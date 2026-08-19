import { useState } from 'react';

const SCORE_LABELS = {
  5: '5 de 5 ★ - Excelente',
  4: '4 de 5 ★ - Muy buena',
  3: '3 de 5 ★ - Buena',
  2: '2 de 5 ★ - Regular',
  1: '1 de 5 ★ - Mala'
};

function ReviewForm({ onAddReview }) {
  const [author, setAuthor] = useState('');
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: campos obligatorios y estrellas seleccionadas
    if (!author.trim() || !comment.trim()) {
      setError('Por favor completá tu nombre y el comentario.');
      return;
    }

    if (!score || score < 1) {
      setError('Por favor seleccioná una calificación con las estrellas.');
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
    setScore(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3 className="review-form-title">Dejar una reseña</h3>

      {error && <p className="review-form-error">{error}</p>}

      <div className="form-field">
        <label className="form-label" htmlFor="review-author">Tu Nombre:</label>
        <input
          id="review-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ej: Martín"
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Tu Calificación:</label>
        <div className="rating-wrapper">
          {/* From Uiverse.io by andrew-demchenk0 */}
          <div className="rating">
            <input
              value="5"
              name="rate"
              id="star5"
              type="radio"
              checked={Number(score) === 5}
              onChange={() => setScore(5)}
            />
            <label title="5 estrellas" htmlFor="star5"></label>

            <input
              value="4"
              name="rate"
              id="star4"
              type="radio"
              checked={Number(score) === 4}
              onChange={() => setScore(4)}
            />
            <label title="4 estrellas" htmlFor="star4"></label>

            <input
              value="3"
              name="rate"
              id="star3"
              type="radio"
              checked={Number(score) === 3}
              onChange={() => setScore(3)}
            />
            <label title="3 estrellas" htmlFor="star3"></label>

            <input
              value="2"
              name="rate"
              id="star2"
              type="radio"
              checked={Number(score) === 2}
              onChange={() => setScore(2)}
            />
            <label title="2 estrellas" htmlFor="star2"></label>

            <input
              value="1"
              name="rate"
              id="star1"
              type="radio"
              checked={Number(score) === 1}
              onChange={() => setScore(1)}
            />
            <label title="1 estrella" htmlFor="star1"></label>
          </div>
          {score > 0 && (
            <span className="rating-score-label">
              {SCORE_LABELS[score]}
            </span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="review-comment">Comentario:</label>
        <textarea
          id="review-comment"
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