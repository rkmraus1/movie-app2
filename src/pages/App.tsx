import { useEffect, useState } from "react";
import "../styles/App.css";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import MovieSection from "../components/MovieSection";
import AnimeSection from "../components/AnimeSection";

type Movie = {
  id: string;
  original_title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids?: number[];
};

type MovieJson = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: string;
  original_language: string;
  original_title: string;
  name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

function App() {
  const [keyword, setKeyword] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [animeList, setAnimeList] = useState<Movie[]>([]);
  const [searchAnimeList, setSearchAnimeList] = useState<Movie[]>([]);
  const [animeKeyword, setAnimeKeyword] = useState("");
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [tvGenres, setTvGenres] = useState<{ [key: number]: string }>({});

  const FetchAnimeList = async () => {
    const excludedGenres = [10751, 10762, 10770, 10766, 99, 10767, 35];

    const allResults: MovieJson[] = [];

    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?with_genres=16&sort_by=popularity.desc&language=ja&page=${page}=1`,
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
        genre_ids: anime.genre_ids,
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
        release_date: anime.first_air_date || "",  
        genre_ids: anime.genre_ids,
        overview: anime.overview || "",
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

  const fetchTvGenres = async () => {
    const response = await fetch("https://api.themoviedb.org/3/genre/tv/list?language=ja", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    });
    const data = await response.json();

    const genreMap: { [key: number]: string } = {};
    data.genres.forEach((genre: { id: number; name: string }) => {
      genreMap[genre.id] = genre.name;
    });

    setTvGenres(genreMap);
  };

  useEffect(() => {
    fetchMovieList();
    FetchAnimeList();
    fetchTvGenres();
  }, [keyword]);

  useEffect(() => {
    fetchAnimeSearchResults(animeKeyword);
  }, [animeKeyword]);


  const displayedAnimeList = animeKeyword ? searchAnimeList : animeList;

  return (
    <div>
      <HeroSection
       heroMovie={heroMovie}
      />

      <MovieSection
        keyword={keyword}
        setKeyword={setKeyword}
        movieList={movieList}
      />

      <AnimeSection
        keyword={animeKeyword}
        setKeyword={setAnimeKeyword}
        animeList={displayedAnimeList}
      />

    </div>
  );
}

export default App;
