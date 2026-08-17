import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

function MovieDetail({ movie, onBack, onAddReview, onDeleteReview }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sin+Poster';

  return (
    <div>
      <button
        onClick={onBack}
        className="back-btn"
      >
        ← Volver a la búsqueda
      </button>

      <div className="detail-layout">
        <img
          src={posterUrl}
          alt={movie.title}
          className="detail-poster"
        />

        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta">
            <span className="detail-meta-item">
              📅 <strong>Estreno:</strong>&nbsp;{movie.release_date || 'Desconocida'}
            </span>
            <span className="detail-meta-item">
              ⭐ <strong>Promedio CineClub:</strong>&nbsp;
              <span className="detail-score-badge">
                {movie.avgScore ? `${movie.avgScore} / 5` : 'Sin reseñas'}
              </span>
            </span>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="detail-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          )}

          <p className="detail-synopsis-heading">Sinopsis</p>
          <p className="detail-synopsis">
            {movie.overview || 'No hay sinopsis disponible en español para esta película.'}
          </p>
        </div>
      </div>

      <hr className="detail-divider" />

      <h2 className="reviews-heading">Reseñas de la Comunidad</h2>
      <ReviewList reviews={movie.reviews} onDeleteReview={onDeleteReview} />
      <ReviewForm onAddReview={onAddReview} />
    </div>
  );
}

export default MovieDetail;