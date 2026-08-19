import { useState } from 'react';

function MovieCard({ movie, onSelect }) {
  // Estado local con useState para controlar el hover de la tarjeta
  const [isHovered, setIsHovered] = useState(false);

  // Verificación de seguridad por si no llega la película
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Poster';

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div
      onClick={() => onSelect(movie.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`movie-card ${isHovered ? 'is-hovered' : ''}`}
    >
      <div className="movie-card-poster-wrapper">
        <img
          src={posterUrl}
          alt={movie.title}
          className="movie-card-poster"
        />

        {/* Overlay con la descripción al hacer hover gestionado con useState */}
        {isHovered && (
          <div className="movie-card-hover-overlay">
            <p className="movie-card-overview">
              {movie.overview || 'Sin descripción disponible.'}
            </p>
            <span className="movie-card-hover-cta">Ver reseñas y detalles →</span>
          </div>
        )}
      </div>

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