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
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}>
      <h3 style={{ marginTop: 0 }}>Dejar una reseña</h3>
      
      {error && <p style={{ color: '#ff4d4f', fontSize: '14px' }}>{error}</p>}

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Tu Nombre:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ej: Martín"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Puntaje (1 al 5):</label>
        <select
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="5">5 - Excelente</option>
          <option value="4">4 - Muy buena</option>
          <option value="3">3 - Buena</option>
          <option value="2">2 - Regular</option>
          <option value="1">1 - Mala</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Comentario:</label>
        <textarea
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribí tu opinión sobre la película..."
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 16px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Publicar Reseña
      </button>
    </form>
  );
}

export default ReviewForm;