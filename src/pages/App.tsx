import { useEffect, useState } from "react";
import "../styles/App.css";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import MovieSection from "../components/MovieSection";
import AnimeSection from "../components/AnimeSection";
import MyListSection from "../components/MyListSection";
import LoginSection from "../components/LoginSection";
import type { Anime, Movie, MovieJson } from "../types/media";
import { auth, db, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import type { User } from "firebase/auth";

type ContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};


function App() {
  const [user, setUser] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchAnimeList, setSearchAnimeList] = useState<Anime[]>([]);
  const [animeKeyword, setAnimeKeyword] = useState("");
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [myList, setMyList] = useState<Movie[]>([]);

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

  

  const fetchMyList = async (userId: string): Promise<Movie[]> => {
    const myListRef = collection(db, "users", userId, "mylist");
    const snapshot = await getDocs(myListRef);
    const list: Movie[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        original_title: data.original_title,
        overview: data.overview,
        poster_path: data.poster_path,
        release_date: data.release_date,
      };
    });
    return list;
};

  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user); // ユーザー情報を更新
  } catch (error) {
    console.error("ログインエラー:", error);
  }
};

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

  useEffect(() => {
  const getList = async () => {
    if (user) {
      const list = await fetchMyList(user.uid);
      setMyList(list);
    } else {
      setMyList([]); // ログアウト時は空に
    }
  };

  getList();
}, [user]);

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
        <MyListSection
        myList={user ? myList : []}
        user={user}
        handleLogin={handleLogin}
         />
      </div>

      <div id="login" className="scroll-mt-14 mt-8 sm:mt-12 mb-10">
        <LoginSection user={user} setUser={setUser} />

      </div>

    </div>
  );

}

export default App;