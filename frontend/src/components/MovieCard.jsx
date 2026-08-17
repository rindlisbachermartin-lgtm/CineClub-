function MovieCard({ movie, onSelect }) {
  // Verificación de seguridad por si no llega la película
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Poster';

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div
      onClick={() => onSelect(movie.id)}
      className="movie-card"
    >
      <img
        src={posterUrl}
        alt={movie.title}
        className="movie-card-poster"
      />
      <div className="movie-card-body">
        <h3 className="movie-card-title">
          {movie.title}
        </h3>
        <div className="movie-card-meta">
          <span>📅 {year}</span>
          <span className="movie-card-score">
            ⭐ {movie.avgScore ? `${movie.avgScore} / 5` : 'Sin reseñas'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;