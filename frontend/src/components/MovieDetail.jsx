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
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Volver a la búsqueda
      </button>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <img
          src={posterUrl}
          alt={movie.title}
          style={{ width: '260px', borderRadius: '8px', objectFit: 'cover' }}
        />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>{movie.title}</h1>
          
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '15px' }}>
            📅 <strong>Estreno:</strong> {movie.release_date || 'Desconocida'} | ⭐ <strong>Promedio CineClub:</strong> {movie.avgScore ? `${movie.avgScore} / 5` : 'Sin reseñas'}
          </p>

          {movie.genres && movie.genres.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <strong>Géneros: </strong>
              {movie.genres.map((g) => g.name).join(', ')}
            </div>
          )}

          <h3>Sinopsis</h3>
          <p style={{ lineHeight: '1.6', color: '#444' }}>
            {movie.overview || 'No hay sinopsis disponible en español para esta película.'}
          </p>
        </div>
      </div>

      <hr style={{ borderColor: '#eee', margin: '30px 0' }} />

      <h2>Reseñas de la Comunidad</h2>
      <ReviewList reviews={movie.reviews} onDeleteReview={onDeleteReview} />
      <ReviewForm onAddReview={onAddReview} />
    </div>
  );
}

export default MovieDetail;