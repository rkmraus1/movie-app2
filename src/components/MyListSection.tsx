import MovieCard from "./MovieCard";
import type { Movie } from "../types/media";

type Props = {
  myList: Movie[];
};

export default function MyListSection({ myList }: Props) {
  return (
    <section className="movie-row-section">
      <h2 className="movie-row-title">マイリスト</h2>
      <div className="movie-row-scroll">
        {myList.length === 0 ? (
          <p className="movie-empty-text">マイリストは空です。</p>
        ) : (
          myList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </section>
  );
}
