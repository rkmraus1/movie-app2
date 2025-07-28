import MovieCard from "./MovieCard";
import type { Movie } from "../types/media";

type Props = {
  myList: Movie[];
  user: any;
};

export default function MyListSection({ myList, user }: Props) {
  if (!user) {
    return (
      <section className="movie-row-section">
        <h2 className="movie-row-title">マイリスト</h2>

        {/* 横並び（スマホは縦に折れる） */}
        <div className="movie-row-scroll flex flex-wrap sm:flex-nowrap gap-6 sm:gap-8 items-center">
          {/* ダミー1 */}
          <div className="relative movie-card">
            <img
              src="https://image.tmdb.org/t/p/w500/yLglTwyFOUZt5fNKm0PWL1PK5gm.jpg"
              alt="君の名は。"
              className="movie-card__image blur-sm opacity-50"
              
            />
          </div>

          {/* ダミー2 */}
          <div className="relative movie-card">
            <img
              src="https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"
              alt="千と千尋の神隠し"
              className="movie-card__image blur-sm opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
              ＋
            </div>
          </div>

          {/* 説明文（PCでは右に、スマホでは下に） */}
          <div className="text-white text-sm sm:text-base font-semibold sm:ml-4 mt-2 sm:mt-0">
            <p className="hidden sm:block">
              マイリストを使用するには<br />ログインしてください
            </p>
            <p className="sm:hidden text-center w-full">
              マイリストを使用するにはログインしてください
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="movie-row-section">
      <h2 className="movie-row-title">マイリスト</h2>
      <div className="movie-row-scroll">
        {myList.length === 0 ? (
          <p className="movie-empty-text">マイリストは空です。</p>
        ) : (
          myList.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        )}
      </div>
    </section>
  );
}
