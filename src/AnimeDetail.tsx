import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./MovieDetail.css";
import { ArrowLeft, Clock, Star } from "lucide-react";

type AnimeDetailJson = {
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

type Anime = {
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

function AnimeDetail() {
    const { id } = useParams();
    const pureId = id?.startsWith("anime-") ? id.slice(6) : id;
    const [anime, setAnime] = useState<Anime | null>(null);

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
            original_title: data.name,
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
                                    <button className="movie-detail-btn">＋ Add to My List</button>
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