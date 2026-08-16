import { useState } from 'react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieDetail from './components/MovieDetail';

// Obtenemos la URL base de la API desde la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  // Estado para la lista de películas buscadas
  const [movies, setMovies] = useState([]);
  
  // Estado para la película seleccionada actualmente (null = Vista de Búsqueda)
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Estados para carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Función para buscar películas
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Error al buscar películas en el servidor');
      }
      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al conectar con el servidor. Verificá que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para cargar el detalle de una película seleccionada
  const handleSelectMovie = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el detalle de la película');
      }
      const data = await response.json();
      setSelectedMovie(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos de la película.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Función para agregar una reseña
  const handleAddReview = async (reviewData) => {
    if (!selectedMovie) return;
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/movies/${selectedMovie.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la reseña');
      }

      // Recargamos los detalles de la película para actualizar las reseñas y el avgScore
      await handleSelectMovie(selectedMovie.id);
    } catch (err) {
      console.error(err);
      setError(err.message || 'No se pudo publicar la reseña.');
    }
  };

  // 4. Función para eliminar una reseña
  const handleDeleteReview = async (reviewId) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la reseña');
      }

      // Recargamos los detalles de la película para actualizar la lista
      await handleSelectMovie(selectedMovie.id);
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la reseña.');
    }
  };

  // 5. Volver a la vista de búsqueda
  const handleBackToSearch = () => {
    setSelectedMovie(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #e50914', paddingBottom: '10px', marginBottom: '25px' }}>
        <h1 
          onClick={handleBackToSearch} 
          style={{ cursor: 'pointer', margin: 0, color: '#e50914', display: 'inline-block' }}
        >
          🎬 CineClub
        </h1>
      </header>

      <main>
        {/* Mensaje de error visible si algo falla */}
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Estado de carga visible */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '30px', fontSize: '18px', color: '#666' }}>
            ⏳ Cargando...
          </div>
        )}

        {/* Render condicional de vistas usando useState */}
        {!loading && (
          <>
            {!selectedMovie ? (
              // Vista 1: Buscador y Grilla de películas
              <div>
                <SearchBar onSearch={handleSearch} />
                <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} />
              </div>
            ) : (
              // Vista 2: Detalle de película y Reseñas
              <MovieDetail
                movie={selectedMovie}
                onBack={handleBackToSearch}
                onAddReview={handleAddReview}
                onDeleteReview={handleDeleteReview}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;