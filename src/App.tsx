import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

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
      anime.genre_ids? !anime.genre_ids.some(id =>
      excludedGenres.includes(id)) &&　anime.original_language === "ja": false
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

  return (
    <div>
      {heroMovie && (
        <section className="hero-section">
          {heroMovie.poster_path && (
            <>
              <img className="hero-section-bg"
                src={`https://image.tmdb.org/t/p/w780${heroMovie.poster_path}`}
                alt={heroMovie.original_title} />
              <div className="hero-section-gradient" />
            </>
          )}
          <div className="hero-section-content">
            <div className="hero-rank-badge">#1</div>
            <h1 className="hero-section-title">{heroMovie.original_title}</h1>

            {heroMovie.overview && (
              <p className="hero-section-overview">{heroMovie.overview}</p>
            )}
            <div className="hero-section-actions">
              <button
                className="hero-section-btn hero-section-btn-primary"
                onClick={() => alert("この機能はまだ実装されていません")}>
                <span>▶ Play</span>
              </button>
              <Link to={`/movies/${heroMovie.id}`}>
                <button className="hero-section-btn hero-section-btn-secondary">
                  <span>More Info</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="movie-row-section">
        <h2 className="movie-row-title">
          {keyword ? `「${keyword}」の検索結果` : "人気映画"}
        </h2>
        <div className="movie-row-scroll">
          {movieList.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </section>

      <div className="app-search-wrap">
        <input
          type="text"
          className="app-search"
          placeholder="映画タイトルで検索..."
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <section className="movie-row-section">
        <h2 className="movie-row-title">人気アニメ</h2>
        <div className="movie-row-scroll">
          {animeList.map((anime) => (


            <MovieCard movie={anime} key={anime.id} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default App;