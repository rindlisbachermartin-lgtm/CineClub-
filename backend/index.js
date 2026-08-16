require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Array en memoria para guardar las reseñas de los usuarios
let reviews = [];

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor CineClub funcionando' });
});

// ==========================================
// 1. BUSCADOR DE PELÍCULAS (GET /api/movies/search?q=...)
// ==========================================
app.get('/api/movies/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'El parámetro de búsqueda "q" es obligatorio' });
  }

  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al consultar la API de TMDB' });
    }

    const data = await response.json();

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
// 2. DETALLE DE PELÍCULA (GET /api/movies/:tmdbId)
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

    // Filtramos las reseñas de esta película
    const movieReviews = reviews.filter((r) => r.movieId === tmdbId.toString());

    // Calculamos el promedio de puntaje
    const avgScore = movieReviews.length > 0
      ? movieReviews.reduce((acc, curr) => acc + curr.score, 0) / movieReviews.length
      : null;

    res.json({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      genres: movie.genres || [],
      reviews: movieReviews,
      avgScore: avgScore ? Number(avgScore.toFixed(1)) : null,
    });
  } catch (error) {
    console.error('Error en detalle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// 3. CREAR RESEÑA (POST /api/movies/:tmdbId/reviews)
// ==========================================
app.post('/api/movies/:tmdbId/reviews', (req, res) => {
  const { tmdbId } = req.params;
  const { author, score, comment } = req.body;

  if (!author || score === undefined || !comment) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: author, score y comment' });
  }

  const numericScore = Number(score);
  if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
    return res.status(400).json({ error: 'El puntaje (score) debe ser un número entre 1 y 5' });
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
// 4. ELIMINAR RESEÑA (DELETE /api/reviews/:reviewId)
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

// Iniciar servidor y mantenerlo escuchando
app.listen(PORT, () => {
  console.log(`Servidor CineClub corriendo en http://localhost:${PORT}`);
});