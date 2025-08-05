import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import type { Movie } from "../types/media";


type Props = {
  myList: Movie[];
  user: any;
  handleLogin: () => void;
};

export default function MyListSection({ myList, user, handleLogin }: Props) {
  if (!user) {
    return (
      <section className="movie-row-section">
        <h2 className="movie-row-title">マイリスト</h2>
        <div className="movie-row-scroll flex flex-wrap sm:flex-nowrap gap-6 sm:gap-8 items-center">
          {/* ダミー1 */}
          <div onClick={handleLogin} className="relative movie-card">
            <img
              src="https://image.tmdb.org/t/p/w500/yLglTwyFOUZt5fNKm0PWL1PK5gm.jpg"
              alt="君の名は。"
              className="movie-card__image blur-sm opacity-50"

            />
          </div>
          {/* ダミー2 */}
          <div onClick={handleLogin} className="relative movie-card">
            <img
              src="https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"
              alt="千と千尋の神隠し"
              className="movie-card__image blur-sm opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
              ＋
            </div>
          </div>

          {/* ✅ ログイン説明テキスト */}
          <div className="text-white text-base sm:text-base font-semibold sm:ml-6 sm:self-center w-full sm:w-auto mt-4 sm:mt-0 mb-6">
            {/* PC用*/}
            <p className="hidden sm:block leading-relaxed">
              ログインしてマイリストを利用する
            </p>

            {/* スマホ用：中央揃えで1行表示 */}
            <p className="sm:hidden text-center leading-relaxed">
              ログインしてマイリストを利用する
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
           myList.map((item) => (
            <Link
              key={item.id}
              to={
                item.type === "anime"
                  ? `/animes/${item.id}`
                  : `/movies/${item.id}`
              }
            >
              <MovieCard movie={item} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}