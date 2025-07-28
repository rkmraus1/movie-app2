import { useEffect, useState } from "react";
import "../styles/App.css";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MovieSection from "../components/MovieSection";
import AnimeSection from "../components/AnimeSection";
import MyListSection from "../components/MyListSection";
import LoginSection from "../components/LoginSection";
import type { Anime, Movie, MovieJson } from "../types/media";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [keyword, setKeyword] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchAnimeList, setSearchAnimeList] = useState<Anime[]>([]);
  const [animeKeyword, setAnimeKeyword] = useState("");
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  const FetchAnimeList = async () => {
    const excludedGenres = [10751, 10762, 10770, 10766, 99, 10767, 35];

    const allResults: MovieJson[] = [];

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?with_genres=16&sort_by=popularity.desc&language=ja&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      allResults.push(...data.results);
    };

    const filteredResults = allResults.filter((anime: MovieJson) =>
      anime.genre_ids ? !anime.genre_ids.some(id =>
        excludedGenres.includes(id)) && anime.original_language === "ja" : false
    );

    const top20 = filteredResults.slice(0, 20);

    setAnimeList(
      top20.map((anime: MovieJson) => ({
        id: anime.id,
        original_title: anime.original_title || anime.name,
        poster_path: anime.poster_path,
        release_date: anime.release_date || "",
        year: Number((anime.release_date || "").split("-")[0]) || 0,
        rating: anime.vote_average,
        runtime: 0,
        score: anime.vote_count,
        genres: [],
        overview: anime.overview || "",
      }))
    );
  };

  const fetchAnimeSearchResults = async (keyword: string) => {
    if (!keyword) {
      setSearchAnimeList([]);
      return;
    }
    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(keyword)}&language=ja&page=1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    });
    const data = await response.json();

    const filteredResults = data.results.filter((anime: MovieJson) =>
      anime.genre_ids?.includes(16)
    );

    setSearchAnimeList(
      filteredResults.map((anime: MovieJson) => ({
        id: anime.id,
        original_title: anime.original_title || anime.name,
        poster_path: anime.poster_path,
        release_date: anime.release_date || "",
        year: Number((anime.release_date || "").split("-")[0]) || 0,
        rating: anime.vote_average,
        runtime: 0,
        score: anime.vote_count,
        genres: [],
      }))
    );
  };

  const fetchMovieList = async () => {
    let url = "";
    if (keyword) {
      url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=ja&page=1`;
    } else {
      url = "https://api.themoviedb.org/3/movie/popular?language=ja&page=1";
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    });

    const data = await response.json();

    setMovieList(
      data.results.slice(1).map((movie: MovieJson) => ({
        id: movie.id,
        original_title: movie.original_title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      }))
    );

    if (!keyword && data.results.length > 0) {
      const first = data.results[0];
      setHeroMovie({
        id: first.id,
        original_title: first.original_title,
        overview: first.overview,
        poster_path: first.poster_path,
        release_date: first.release_date,
      });
    }
  };

  const [myList, _] = useState<Movie[]>([
    {
      id: "1",
      original_title: "君の名は。",
      overview: "ある日、入れ替わった2人の高校生の物語。",
      poster_path: "/yLglTwyFOUZt5fNKm0PWL1PK5gm.jpg",
      release_date: "2016-08-26",
    },
    {
      id: "2",
      original_title: "千と千尋の神隠し",
      overview: "不思議な世界に迷い込んだ少女の冒険。",
      poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
      release_date: "2001-07-20",
    }
  ]);


  useEffect(() => {
    fetchMovieList();
    FetchAnimeList();
  }, [keyword]);

  useEffect(() => {
    fetchAnimeSearchResults(animeKeyword);
  }, [animeKeyword]);


  //ログイン情報の受け取り
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const [user, setUser] = useState<any>(null);


  const displayedAnimeList = animeKeyword ? searchAnimeList : animeList;

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <Header user={user} />

      <HeroSection heroMovie={heroMovie} />

      <div id="movie" className="scroll-mt-14 mt-8 sm:mt-12">
        <MovieSection
          keyword={keyword}
          setKeyword={setKeyword}
          movieList={movieList}
        />
      </div>

      <div id="anime" className="scroll-mt-14 mt-8 sm:mt-12">
        <AnimeSection
          keyword={animeKeyword}
          setKeyword={setAnimeKeyword}
          animeList={displayedAnimeList}
        />
      </div>

      <div id="mylist" className="scroll-mt-14 mt-8 sm:mt-12 mb-10">
        <MyListSection myList={myList} />
      </div>

      <div id="login" className="scroll-mt-14 mt-8 sm:mt-12 mb-10">
        <LoginSection user={user} setUser={setUser} />

      </div>

    </div>
  );

}

export default App;