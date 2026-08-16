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
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <img
        src={posterUrl}
        alt={movie.title}
        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
      />
      <div
        style={{
          padding: '12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
          {movie.title}
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <span>📅 {year}</span>
          <span>⭐ {movie.avgScore ? `${movie.avgScore} / 5` : 'Sin reseñas'}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;