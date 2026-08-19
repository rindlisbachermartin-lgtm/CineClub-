require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Array en memoria para almacenar las reseñas de los usuarios
let reviews = [];

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de comprobación de estado
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor CineClub funcionando' });
});

// ==========================================
// 1. BUSCADOR DE PELÍCULAS (GET /api/movies/search?q=...)
// ==========================================
app.get('/api/movies/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'El parámetro "q" es obligatorio' });
  }

  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al consultar la API de TMDB' });
    }

    const data = await response.json();

    // Adjuntamos a cada película su calificación promedio calculada de las reseñas locales
    const resultsWithAvgScore = (data.results || []).map((movie) => {
      const movieReviews = reviews.filter((r) => r.movieId === movie.id.toString());
      const avgScore = movieReviews.length > 0
        ? movieReviews.reduce((acc, curr) => acc + curr.score, 0) / movieReviews.length
        : null;

      return {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        overview: movie.overview,
        avgScore: avgScore ? Number(avgScore.toFixed(1)) : null,
      };
    });

    res.json({ results: resultsWithAvgScore });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 2. PELÍCULAS TOP RATED (GET /api/movies/top-rated)
// Para poblar el carrusel de la pantalla de inicio
// ==========================================
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=es-ES&page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al consultar TMDB' });
    }

    const data = await response.json();

    const resultsWithAvgScore = (data.results || []).slice(0, 20).map((movie) => {
      const movieReviews = reviews.filter((r) => r.movieId === movie.id.toString());
      const avgScore = movieReviews.length > 0
        ? movieReviews.reduce((acc, curr) => acc + curr.score, 0) / movieReviews.length
        : null;

      return {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : null,
        overview: movie.overview,
        avgScore: avgScore ? Number(avgScore.toFixed(1)) : null,
      };
    });

    res.json({ results: resultsWithAvgScore });
  } catch (error) {
    console.error('Error al obtener top-rated:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 3. DETALLE DE PELÍCULA (GET /api/movies/:tmdbId)
// ==========================================
app.get('/api/movies/:tmdbId', async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ error: 'Película no encontrada en TMDB' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al consultar TMDB' });
    }

    const movie = await response.json();

    // Filtramos las reseñas correspondientes a esta película
    const movieReviews = reviews.filter((r) => r.movieId === tmdbId.toString());

    // Calculamos el promedio de puntuación
    const avgScore = movieReviews.length > 0
      ? movieReviews.reduce((acc, curr) => acc + curr.score, 0) / movieReviews.length
      : null;

    // Buscamos el trailer oficial de YouTube
    let trailerKey = null;
    try {
      const videosUrl = `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=es-ES`;
      const resVideos = await fetch(videosUrl);
      let videosData = resVideos.ok ? await resVideos.json() : null;

      let trailer = (videosData?.results || []).find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );

      // Si no hay trailer en español, buscamos en inglés
      if (!trailer) {
        const videosUrlEn = `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
        const resVideosEn = await fetch(videosUrlEn);
        if (resVideosEn.ok) {
          const videosDataEn = await resVideosEn.json();
          trailer = (videosDataEn?.results || []).find(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          ) || (videosDataEn?.results || []).find((v) => v.site === 'YouTube');
        }
      }

      trailerKey = trailer ? trailer.key : null;
    } catch (vErr) {
      console.warn('No se pudo obtener el trailer:', vErr);
    }

    res.json({
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title || movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      runtime: movie.runtime,
      vote_average: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : null,
      genres: movie.genres || [],
      trailer_key: trailerKey,
      reviews: movieReviews,
      avgScore: avgScore ? Number(avgScore.toFixed(1)) : null,
    });
  } catch (error) {
    console.error('Error en detalle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 4. CREAR RESEÑA (POST /api/movies/:tmdbId/reviews)
// ==========================================
app.post('/api/movies/:tmdbId/reviews', (req, res) => {
  const { tmdbId } = req.params;
  const { author, score, comment } = req.body;

  // Validación de campos obligatorios
  if (!author || score === undefined || !comment) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: author, score y comment' });
  }

  const numericScore = Number(score);
  if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
    return res.status(400).json({ error: 'El puntaje debe ser un número entre 1 y 5' });
  }

  const newReview = {
    id: Date.now().toString(),
    movieId: tmdbId.toString(),
    author: author.trim(),
    score: numericScore,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);

  res.status(201).json(newReview);
});

// ==========================================
// 5. ELIMINAR RESEÑA (DELETE /api/reviews/:reviewId)
// ==========================================
app.delete('/api/reviews/:reviewId', (req, res) => {
  const { reviewId } = req.params;

  const reviewIndex = reviews.findIndex((r) => r.id === reviewId.toString());

  if (reviewIndex === -1) {
    return res.status(404).json({ error: 'Reseña no encontrada' });
  }

  const deletedReview = reviews.splice(reviewIndex, 1)[0];

  res.json({ message: 'Reseña eliminada con éxito', review: deletedReview });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor CineClub corriendo en http://localhost:${PORT}`);
});