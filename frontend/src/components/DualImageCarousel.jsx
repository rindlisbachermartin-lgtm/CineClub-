import { useState, useEffect } from 'react';
import './DualImageCarousel.css';

// Lista de respaldo en caso de que el backend no esté disponible
const FALLBACK_MOVIES = [
  { id: 238, title: 'El Padrino', year: '1972', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
  { id: 278, title: 'Cadena perpetua', year: '1994', poster_path: '/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg' },
  { id: 240, title: 'El Padrino Parte II', year: '1974', poster_path: '/v3qq09nkV12u8g3F4uGk4J4iJ3T.jpg' },
  { id: 424, title: 'La lista de Schindler', year: '1993', poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
  { id: 155, title: 'El caballero de la noche', year: '2008', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 496243, title: 'Parásitos', year: '2019', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
  { id: 680, title: 'Pulp Fiction', year: '1994', poster_path: '/hNcQFc0NsfnR4mI3B5Vgf30iMba.jpg' },
  { id: 13, title: 'Forrest Gump', year: '1994', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
  { id: 157336, title: 'Interstellar', year: '2014', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 122, title: 'El retorno del Rey', year: '2003', poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fila individual del carrusel infinito (se mueve a la izquierda o derecha)
 */
function CarouselRow({ items, direction = 'left', onSelectMovie }) {
  const getPosterUrl = (movie) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=Sin+Poster';
  };

  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  // Renderizamos las tarjetas de las películas
  const renderCards = (keyPrefix) => (
    <div className="carousel-group">
      {items.map((movie) => (
        <div
          key={`${keyPrefix}-${movie.id}`}
          className="carousel-card"
          onClick={() => onSelectMovie && onSelectMovie(movie.id)}
          title={movie.title}
        >
          <img
            src={getPosterUrl(movie)}
            alt={movie.title}
            className="carousel-card-img"
            loading="lazy"
          />
          <div className="carousel-card-overlay">
            <h4 className="carousel-card-title">{movie.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="carousel-row">
      <div className={`carousel-track ${animationClass}`}>
        {renderCards('original')}
        {renderCards('clon-1')}
        {renderCards('clon-2')}
      </div>
    </div>
  );
}

/**
 * Componente DualImageCarousel:
 * Muestra dos filas de películas en movimiento continuo en la pantalla principal.
 */
export default function DualImageCarousel({ onSelectMovie }) {
  const [movies, setMovies] = useState(FALLBACK_MOVIES);

  // Cargamos las películas mejor valoradas al montar el componente
  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const res = await fetch(`${API_URL}/api/movies/top-rated`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setMovies(data.results);
          }
        }
      } catch (err) {
        console.warn('Usando catálogo local para el carrusel:', err);
      }
    }
    fetchTopMovies();
  }, []);

  // Dividimos la lista en dos filas (pares e impares)
  const row1 = movies.filter((_, idx) => idx % 2 === 0);
  const row2 = movies.filter((_, idx) => idx % 2 !== 0);

  return (
    <section className="dual-carousel-container" aria-label="Películas destacadas">
      <div className="dual-carousel-viewport">
        {/* Fila 1: hacia la izquierda */}
        <CarouselRow items={row1} direction="left" onSelectMovie={onSelectMovie} />
        {/* Fila 2: hacia la derecha */}
        <CarouselRow items={row2} direction="right" onSelectMovie={onSelectMovie} />
      </div>
    </section>
  );
}
