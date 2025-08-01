// src/hooks/useMovies.ts
import { useEffect, useState } from "react";
import type { Movie } from "../types/media";

export const useMovies = (keyword: string) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      let url = "";

      if (keyword) {
        url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=ja&page=1`;
      } else {
        url = "https://api.themoviedb.org/3/movie/popular?language=ja&page=1";
      }

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        });

        const data = await response.json();

        const movies = data.results.map((movie: any) => ({
          id: movie.id,
          original_title: movie.original_title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        }));

        setMovieList(movies.slice(1)); // 2番目以降をmovieListに
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
      } catch (error) {
        console.error("映画データの取得に失敗しました", error);
      }
    };

    fetchMovies();
  }, [keyword]);

  return { movieList, heroMovie };
};
