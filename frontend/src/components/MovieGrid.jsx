import MovieCard from './MovieCard';

function MovieGrid({ movies, onSelectMovie }) {
  if (!movies || movies.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>
        No hay películas para mostrar. Escribí un título arriba y presioná "Buscar".
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
        marginTop: '20px',
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
      ))}
    </div>
  );
}

export default MovieGrid;