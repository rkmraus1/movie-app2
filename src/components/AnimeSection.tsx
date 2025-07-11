import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

interface AnimeSectionProps {
  animeList: Movie[];
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export default function AnimeSection({ animeList, keyword, setKeyword }: AnimeSectionProps) {
  return (
    <>
      <section className="movie-row-section">
        <h2 className="movie-row-title">
          {keyword ? `「${keyword}」の検索結果` : "人気アニメ"}
        </h2>
        <div className="movie-row-scroll">
          {animeList.map((anime) => (
            <Link to={`/animes/anime-${anime.id}`} key={anime.id}>
              <MovieCard movie={anime} />
            </Link>
          ))}
        </div>
      </section>

      <div className="app-search-wrap">
        <input
          type="text"
          className="app-search"
          placeholder="アニメタイトルで検索..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </>
  );
}
