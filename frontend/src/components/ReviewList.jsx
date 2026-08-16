function ReviewList({ reviews, onDeleteReview }) {
  if (!reviews || reviews.length === 0) {
    return <p style={{ color: '#777' }}>Aún no hay reseñas para esta película. ¡Sé el primero en opinar!</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
      {reviews.map((rev) => (
        <div
          key={rev.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: '#f9f9f9',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <strong style={{ fontSize: '15px', color: '#222' }}>{rev.author}</strong>
            <span style={{ fontWeight: 'bold', color: '#e50914' }}>⭐ {rev.score} / 5</span>
          </div>
          <p style={{ margin: '0 0 10px 0', color: '#444', fontSize: '14px' }}>{rev.comment}</p>
          <button
            onClick={() => onDeleteReview(rev.id)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#ff4d4f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar reseña
          </button>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;