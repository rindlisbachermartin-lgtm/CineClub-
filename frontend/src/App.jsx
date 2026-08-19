import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieDetail from './components/MovieDetail';
import DualImageCarousel from './components/DualImageCarousel';

// Obtenemos la URL base de la API desde la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  // Estado para la lista de películas buscadas
  const [movies, setMovies] = useState([]);
  
  // Estado para la película seleccionada actualmente (null = Vista de Búsqueda)
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Estados para carga, errores y notificaciones de éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Función para mostrar notificación temporal de éxito (3.5 segundos)
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3500);
  };

  // Si se realizó al menos una búsqueda
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Función para buscar películas
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
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
      showSuccess('Reseña publicada con éxito.');
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
      showSuccess('Reseña eliminada correctamente.');
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la reseña.');
    }
  };

  // 5. Volver a la vista de búsqueda (desde el detalle)
  const handleBackToSearch = () => {
    setSelectedMovie(null);
    setError(null);
  };

  // 6. Volver a la pantalla principal de inicio
  const handleGoHome = () => {
    setSelectedMovie(null);
    setHasSearched(false);
    setMovies([]);
    setError(null);
  };

  // ¿Estamos en la pantalla de inicio (sin resultados ni película)?
  const isHero = !selectedMovie && !hasSearched;

  return (
    <div className={`app-root${isHero ? ' is-hero' : ''}`}>

      {/* Notificación de éxito flotante */}
      {successMessage && (
        <div className="success-toast" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      {/* ── HERO (estado inicial) ── */}
      {isHero && (
        <div className="ev-hero-wrapper">
          <div className="ev-hero">
            <header id="ev-header">
              <h1>
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/039/557/662/small/ai-generated-transparent-popcorn-pile-adding-texture-and-realism-to-graphic-compositions-free-png.png"
                  alt="Popcorn"
                  className="title-popcorn-icon"
                />
                CineClub
              </h1>
              <p>Buscá tu película favorita y dejá tu reseña.<br />
              Tu comunidad de cine te espera.</p>
            </header>
            <SearchBar onSearch={handleSearch} heroMode />
          </div>

          <div className="hero-film-carousel">
            <DualImageCarousel onSelectMovie={handleSelectMovie} />
          </div>
        </div>
      )}

      {/* ── VISTA NORMAL (con resultados o detalle) ── */}
      {!isHero && (
        <div className="app-wrapper">
          <header className="app-header">
            <h1
              className="app-logo"
              onClick={handleGoHome}
            >
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/039/557/662/small/ai-generated-transparent-popcorn-pile-adding-texture-and-realism-to-graphic-compositions-free-png.png"
                alt="Popcorn"
                className="logo-popcorn-icon"
              />
              CineClub
            </h1>
            <span className="app-tagline">Tu comunidad de cine</span>
          </header>

          <main>
            {/* Mensaje de error visible si algo falla */}
            {error && (
              <div className="error-banner">
                ⚠️ {error}
              </div>
            )}

            {/* Estado de carga visible */}
            {loading && (
              <div className="loading-state">
                Cargando...
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
      )}

    </div>
  );

}

export default App;