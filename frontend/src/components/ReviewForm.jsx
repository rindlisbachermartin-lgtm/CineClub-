import { useState } from 'react';

function ReviewForm({ onAddReview }) {
  const [author, setAuthor] = useState('');
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica: campos obligatorios
    if (!author.trim() || !comment.trim()) {
      setError('Por favor completá tu nombre y el comentario.');
      return;
    }

    setError('');
    onAddReview({
      author: author.trim(),
      score: Number(score),
      comment: comment.trim()
    });

    // Limpiar formulario
    setAuthor('');
    setScore(5);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3 className="review-form-title">Dejar una reseña</h3>

      {error && <p className="review-form-error">{error}</p>}

      <div className="form-field">
        <label className="form-label">Tu Nombre:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ej: Martín"
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Puntaje (1 al 5):</label>
        <select
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="form-select"
        >
          <option value="5">5 - Excelente</option>
          <option value="4">4 - Muy buena</option>
          <option value="3">3 - Buena</option>
          <option value="2">2 - Regular</option>
          <option value="1">1 - Mala</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Comentario:</label>
        <textarea
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribí tu opinión sobre la película..."
          className="form-textarea"
        />
      </div>

      <button type="submit" className="submit-btn">
        Publicar Reseña
      </button>
    </form>
  );
}

export default ReviewForm;