import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MediaCard from "./MediaCard";
import ConfirmModal from "./ConfirmModel";
import { removeFromMyList } from "../lib/mylist";
import { useMyList } from "../hooks/useMyList";
import { useState } from "react";
import type { Movie, Anime } from "../types/media";
type Props = {
  user: any;
  handleLogin: () => void;
};



export default function MyListSection({ user, handleLogin }: Props) {
  const { myList, refresh } = useMyList(user?.uid || null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [targetItem, setTargetItem] = useState<Movie | Anime | null>(null);

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
           
          <p className="movie-empty-text  text-white ">マイリストは空です。</p>
        ) : (
          myList.map((item) => (
            <div key={item.id} className="relative inline-block mr-4 group">
              {/* ✅ 削除ボタンを外に出す */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTargetItem(item);
                  setShowConfirm(true);
                }}
                className="absolute top-1.5 right-1.5 text-white text-[11px] px-1 py-0.5 rounded-full bg-gray-800 bg-opacity-30 hover:bg-opacity-40 hover:scale-105 transition-all duration-200 z-10 
    opacity-100 sm:opacity-0 group-hover:sm:opacity-100"
              >
                ✕
              </button>

              <Link
                to={
                  item.type === "anime"
                    ? `/animes/${item.id}`
                    : `/movies/${item.id}`
                }
              >
                <MediaCard movie={item} />
              </Link>
            </div>
          ))

        )}
      </div>
      {showConfirm && targetItem && (
        <ConfirmModal
          message="この作品をマイリストから削除しますか？"
          onConfirm={async () => {
            try {
              await removeFromMyList(user.uid, targetItem.id);
              toast.success("削除しました");
              await refresh();
            } catch (error) {
              console.error("削除エラー:", error);
              toast.error("削除に失敗しました");
            } finally {
              setShowConfirm(false);
              setTargetItem(null);
            }
          }}
          onCancel={() => {
            setShowConfirm(false);
            setTargetItem(null);
          }}
        />
      )}
    </section>
  );
}