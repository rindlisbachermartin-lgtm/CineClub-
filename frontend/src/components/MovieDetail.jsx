import { useState } from 'react';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

/**
 * Componente MovieDetail:
 * Muestra el detalle completo de una película seleccionada, su trailer de YouTube,
 * la lista de reseñas de la comunidad y el formulario para agregar una nueva reseña.
 */
function MovieDetail({ movie, onBack, onAddReview, onDeleteReview }) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  if (!movie) return null;

  // URLs para imágenes con fallback por si no tiene póster o backdrop
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Poster';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterUrl;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  // Formatea minutos a formato legible (ej: 120 -> "2h 0min")
  const formatRuntime = (mins) => {
    if (!mins) return 'Duración no disp.';
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const trailerKey = movie.trailer_key;

  return (
    <div className="imdb-detail-container">
      {/* Botón para regresar (Uiverse.io) */}
      <button onClick={onBack} className="imdb-back-btn">
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
        <span>Volver</span>
      </button>

      {/* ── 1. ENCABEZADO (Título, año, duración y puntaje promedio) ── */}
      <header className="imdb-header">
        <div className="imdb-header-left">
          <h1 className="imdb-title">{movie.title}</h1>
          <div className="imdb-submeta">
            <span className="imdb-orig-title">
              Título original: {movie.original_title || movie.title}
            </span>
            <div className="imdb-specs">
              <span>{year}</span>
              <span className="dot">•</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
        </div>

        <div className="imdb-header-right">
          {/* Calificación promedio de CineClub con las 5 estrellas visuales */}
          <div className="imdb-metric-box">
            <span className="metric-label">CALIFICACIÓN CINECLUB</span>
            <div className="metric-content">
              <div className="metric-score-group">
                <div className="metric-stars-header">
                  <div className="review-stars-display" aria-label={`Calificación: ${movie.avgScore || 0} de 5`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`display-star ${movie.avgScore && star <= Math.round(movie.avgScore) ? 'filled' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="metric-score-val">
                    <strong>{movie.avgScore ? movie.avgScore : '-'}</strong>
                    <span className="metric-denom">/5</span>
                  </div>
                </div>
                <span className="metric-sub">
                  {movie.reviews && movie.reviews.length > 0
                    ? `${movie.reviews.length} ${movie.reviews.length === 1 ? 'reseña' : 'reseñas'}`
                    : 'Sin reseñas'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. SECCIÓN DE MEDIOS (Póster + Trailer oficial de YouTube) ── */}
      <section className="imdb-media-grid">
        <div className="imdb-poster-card">
          <img src={posterUrl} alt={movie.title} className="imdb-poster-img" />
        </div>

        <div className="imdb-backdrop-card">
          {isPlayingTrailer && trailerKey ? (
            <div className="youtube-player-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`Trailer Oficial - ${movie.title}`}
                className="youtube-iframe"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                className="close-trailer-inline-btn"
                onClick={() => setIsPlayingTrailer(false)}
                title="Cerrar video"
              >
                ✕ Cerrar video
              </button>
            </div>
          ) : (
            <>
              <img src={backdropUrl} alt={movie.title} className="imdb-backdrop-img" />
              <div className="imdb-backdrop-scrim" />

              {/* Botón para reproducir el trailer si está disponible */}
              {trailerKey ? (
                <div
                  className="imdb-trailer-cta"
                  onClick={() => setIsPlayingTrailer(true)}
                >
                  <div className="play-button-circle">
                    <span className="play-triangle">▶</span>
                  </div>
                  <div className="trailer-text-group">
                    <span className="trailer-title">Reproducir trailer oficial</span>
                    <span className="trailer-duration">HD YouTube</span>
                  </div>
                </div>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer oficial')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="imdb-trailer-cta link-cta"
                >
                  <div className="play-button-circle">
                    <span className="play-triangle">↗</span>
                  </div>
                  <div className="trailer-text-group">
                    <span className="trailer-title">Buscar trailer en YouTube</span>
                    <span className="trailer-duration">Ver en pestaña nueva</span>
                  </div>
                </a>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 3. GÉNEROS Y SINOPSIS ── */}
      <section className="imdb-content-section">
        {movie.genres && movie.genres.length > 0 && (
          <div className="imdb-genres-list">
            {movie.genres.map((g) => (
              <span key={g.id} className="imdb-genre-pill">
                {g.name}
              </span>
            ))}
          </div>
        )}

        <div className="imdb-synopsis-box">
          <p className="imdb-synopsis-text">
            {movie.overview || 'No hay sinopsis disponible en español para esta película.'}
          </p>
        </div>
      </section>

      {/* ── 4. RESEÑAS DE LA COMUNIDAD Y FORMULARIO ── */}
      <hr className="detail-divider" />
      <h2 className="reviews-heading">Reseñas de la Comunidad</h2>
      
      {/* Componente para listar reseñas existentes */}
      <ReviewList reviews={movie.reviews} onDeleteReview={onDeleteReview} />
      
      {/* Componente para agregar una nueva reseña */}
      <div id="review-form-section">
        <ReviewForm onAddReview={onAddReview} />
      </div>
    </div>
  );
}

export default MovieDetail;