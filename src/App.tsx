import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./MovieCard";

type Movie = {
  id: string;
  original_title: string;
  poster_path: string;
  overview: string;
  release_date: string;
};

type MovieJson = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: string;
  original_language: string;
  original_title: string;
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
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

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
      data.results.map((movie: MovieJson) => ({
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

  useEffect(() => {
    fetchMovieList();
  }, [keyword]);

  return (
    <div>
      {heroMovie && (
        <>
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
              <h1 className="hero-section-title">{heroMovie.original_title}</h1>

              <div className="hero-section-badges">
                {heroMovie.release_date && (
                  <span className="hero-section-badge">{new Date(heroMovie.release_date).getFullYear()}</span>
                )}
              </div>
              {heroMovie.overview && (
                <p className="hero-section-overview">{heroMovie.overview}</p>
              )}
              <div className="hero-section-actions">
                <button className="hero-section-btn hero-section-btn-primary">
                  <span>▶ Play</span>
                </button>
                <button className="hero-section-btn hero-section-btn-secondary">
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </section>
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
        </>
      )}

      <div className="app-search-wrap">
        <input
          type="text"
          className="app-search"
          placeholder="映画タイトルで検索..."
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </div>
  );
}

export default App;