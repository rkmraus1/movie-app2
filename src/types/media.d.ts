export type Movie = {
  id: string;
  original_title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids?: number[];
  type?: "movie" | "anime";
};

export type MovieDetail = {
  id: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  year: number;
  rating: number;
  runtime: number;
  score: number;
  genres: string[];
  vote_average: number; 
};

// 一覧・検索取得用
export type MovieJson = {
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

// 詳細取得用
export type MovieDetailJson = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type Anime = {
    id: string;
    original_title: string;
    overview: string;
    poster_path: string;
    year: number;
    rating: number;
    runtime: number;
    score: number;
    genres: string[];
};

export type AnimeDetailJson = {
    backdrop_path: string | null;
    genres: { id: number; name: string }[];
    id: string;
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    episode_run_time: number[];
};