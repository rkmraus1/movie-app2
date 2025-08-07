import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { addToMyList } from "../lib/mylist";
import { useMyList } from "../hooks/useMyList";
import type { Anime, AnimeDetailJson } from "../types/media";
import "../styles/MovieDetail.css";

type ContextType = {
    user: any;
    setUser: (user: any) => void;
};

function AnimeDetail() {
    const { id } = useParams();
    const pureId = id?.startsWith("anime-") ? id.slice(6) : id;
    const [anime, setAnime] = useState<Anime | null>(null);
    const { user } = useOutletContext<ContextType>();
    const { myList, refresh } = useMyList(user?.uid || null);


    const fetchAnimeDetail = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${pureId}?language=ja`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
                },
            }
        );
        const data = await response.json() as AnimeDetailJson;

        setAnime({
            id: String(data.id),
            original_title: data.original_name,
            overview: data.overview,
            poster_path: data.poster_path,
            year: Number(data.first_air_date?.split("-")[0] ?? "0"),
            rating: data.vote_average,
            runtime: data.episode_run_time?.[0] ?? 0,
            score: data.vote_count,
            genres: data.genres.map((g) => g.name),
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAnimeDetail();
    }, [pureId])

    return (
        <div className="movie-detail-root">
            {anime && (
                <>
                    <div
                        className="movie-detail-backdrop"
                        style={{
                            backgroundImage: `url(${"https://image.tmdb.org/t/p/w500" + anime.poster_path
                                })`,
                        }}
                    />
                    <div className="movie-detail-backdrop-gradient" />
                    <div className="movie-detail-container">
                        <Link to="/" className="movie-detail-backlink">
                            <ArrowLeft className="movie-detail-backlink-icon" size={20} />
                            Back to home
                        </Link>
                        <div className="movie-detail-grid">
                            <div className="movie-detail-poster-wrap">
                                <img
                                    src={"https://image.tmdb.org/t/p/w500" + anime.poster_path}
                                    alt={anime.original_title}
                                    className="movie-detail-poster-img"
                                />
                            </div>
                            <div className="movie-detail-details">
                                <h1 className="movie-detail-title">{anime.original_title}</h1>
                                <div className="movie-detail-badges">
                                    <span className="badge-outline">{anime.year}</span>
                                    <span className="badge-outline">PG-13</span>
                                    <span className="badge-outline">
                                        <Clock className="badge-icon-svg" size={14} />
                                        {anime.runtime}分
                                    </span>
                                    <span className="badge-outline">
                                        <Star className="badge-icon-svg badge-star" size={14} />
                                        {(anime.rating / 2).toFixed(1)}
                                    </span>
                                </div>
                                <p className="movie-detail-overview">{anime.overview}</p>
                                <div className="movie-detail-genres">
                                    {anime.genres.map((g) => (
                                        <span key={g} className="badge-genre">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                                <div className="movie-detail-actions">
                                    <button
                                        className="movie-detail-btn movie-detail-btn-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert("この機能はまだ実装されていません");
                                        }}
                                    >
                                        ▶ Watch Now
                                    </button>
                                    <button
                                        className="movie-detail-btn"
                                        onClick={async () => {
                                            if (!user) {
                                                toast.info("ログインしてください");
                                                return;
                                            }

                                            await refresh();

                                            if (!anime) return;

                                            const isInMyList = myList.some((item) => item.id === anime.id);
                                            if (isInMyList) {
                                                toast.warning("この作品はすでに追加されています。");
                                                return;
                                            }

                                            try {
                                                await addToMyList(user.uid, anime, "anime");
                                                toast.success("マイリストに追加しました");
                                            } catch (error) {
                                                console.error("マイリスト追加エラー:", error);
                                                toast.error("追加に失敗しました");
                                            }
                                        }}
                                    >
                                        ＋ Add to My List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!anime && <p>Loading...</p>}
        </div>
    );
}

export default AnimeDetail;