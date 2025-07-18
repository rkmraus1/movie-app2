import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import type { Anime } from "../types/media";

interface AnimeSectionProps {
  animeList: Anime[];
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export default function AnimeSection({ animeList, keyword, setKeyword }: AnimeSectionProps) {

  // ▼ animeListから重複IDのアニメを除去（同じidがあるとReactのkey警告が出るため）
  const uniqueAnimeList = animeList.filter(
    (anime, index, self) =>
      self.findIndex((a) => a.id === anime.id) === index
  );


  return (
    <>
      <section className="movie-row-section">
        <h2 className="movie-row-title">
          {keyword ? `「${keyword}」の検索結果` : "人気アニメ"}
        </h2>
        <div className="movie-row-scroll">
          {uniqueAnimeList.map((anime) => (
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
