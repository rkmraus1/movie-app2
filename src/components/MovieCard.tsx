import "../styles/App.css";

type Movie = {
  id: string;
  poster_path: string;
  original_title: string;
};

type Props = {
  movie: Movie;
};

const MovieCard = (props: Props) => {
  const { movie } = props;

  return (
    <div className="movie-card">
      <div className="movie-card__imgwrap">
        <img
          src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
          alt={movie.original_title}
          className="movie-card__image"
        />
        <div className="movie-card__overlay">
          <h3 className="movie-card__title">{movie.original_title}</h3>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;