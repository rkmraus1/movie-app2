import { Link } from "react-router-dom";

type HeroSectionProps = {
  heroMovie: Movie | null;
};

export default function HeroSection({ heroMovie }: HeroSectionProps) {
  if (!heroMovie) return null;

  return (
    <section className="hero-section">
      {heroMovie.poster_path && (
        <>
          <img
            className="hero-section-bg"
            src={`https://image.tmdb.org/t/p/w780${heroMovie.poster_path}`}
            alt={heroMovie.original_title}
          />
          <div className="hero-section-gradient" />
        </>
      )}
      <div className="hero-section-content">
        <div className="hero-rank-badge">#1</div>
        <h1 className="hero-section-title">{heroMovie.original_title}</h1>

        {heroMovie.overview && (
          <p className="hero-section-overview">{heroMovie.overview}</p>
        )}
        <div className="hero-section-actions">
          <button
            className="hero-section-btn hero-section-btn-primary"
            onClick={() => alert("この機能はまだ実装されていません")}
          >
            <span>▶ Play</span>
          </button>
          <Link to={`/movies/${heroMovie.id}`}>
            <button className="hero-section-btn hero-section-btn-secondary">
              <span>More Info</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
