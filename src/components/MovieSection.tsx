import { Link } from "react-router-dom";
import MediaCard from "./MediaCard";

interface MovieSectionProps {
  keyword: string;
  setKeyword: (value: string) => void;
  movieList: {
    id: string;
    original_title: string;
    poster_path: string;
    overview: string;
    release_date: string;
  }[];
}

export default function MovieSection({ keyword, setKeyword, movieList }: MovieSectionProps) {
  return (
    <>
      <section className="movie-row-section">
        <h2 className="movie-row-title">
          {keyword ? `「${keyword}」の検索結果` : "人気映画"}
        </h2>
        <div className="movie-row-scroll">
          {movieList.map((movie) => (
            <Link to={`/movies/${movie.id}`} key={movie.id}>
              <MediaCard movie={movie} />
            </Link>
          ))}
        </div>
      </section>

      <div className="app-search-wrap">
        <input
          type="text"
          className="app-search"
          placeholder="映画タイトルで検索..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </>
  );
}

