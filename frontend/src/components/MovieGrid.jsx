import MovieCard from './MovieCard';

function MovieGrid({ movies, onSelectMovie }) {
  if (!movies || movies.length === 0) {
    return (
      <p className="grid-empty">
        No hay películas para mostrar. Escribí un título arriba y presioná "Buscar".
      </p>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
      ))}
    </div>
  );
}

export default MovieGrid;