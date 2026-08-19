function ReviewList({ reviews, onDeleteReview }) {
  if (!reviews || reviews.length === 0) {
    return <p className="reviews-empty">Aún no hay reseñas para esta película. ¡Sé el primero en opinar!</p>;
  }

  // Pedir confirmación al usuario antes de eliminar
  const handleDelete = (reviewId) => {
    const isConfirmed = window.confirm('¿Estás seguro de que querés eliminar esta reseña?');
    if (isConfirmed) {
      onDeleteReview(reviewId);
    }
  };

  return (
    <div className="reviews-list">
      {reviews.map((rev) => {
        const scoreNum = Number(rev.score) || 0;
        return (
          <div key={rev.id} className="review-card">
            <div className="review-header">
              <strong className="review-author">{rev.author}</strong>
              <div className="review-score-container" title={`Calificación: ${scoreNum}/5`}>
                <div className="review-stars-display" aria-label={`${scoreNum} de 5 estrellas`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`display-star ${star <= scoreNum ? 'filled' : 'empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="review-score-text">({scoreNum}/5)</span>
              </div>
            </div>
            <p className="review-comment">{rev.comment}</p>
            {/* Botón Eliminar (From Uiverse.io by andrew-demchenk0) */}
            <button
              type="button"
              onClick={() => handleDelete(rev.id)}
              className="review-delete-btn"
              title="Eliminar reseña"
            >
              <span className="review-delete-btn__text">Eliminar</span>
              <span className="review-delete-btn__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" viewBox="0 0 512 512" height="512" className="svg">
                  <path style={{ fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"></path>
                  <line y2="112" y1="112" x2="432" x1="80" style={{ stroke: 'currentColor', strokeLinecap: 'round', strokeMiterlimit: 10, strokeWidth: '32px' }}></line>
                  <path style={{ fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"></path>
                  <line y2="400" y1="176" x2="256" x1="256" style={{ fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></line>
                  <line y2="400" y1="176" x2="192" x1="184" style={{ fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></line>
                  <line y2="400" y1="176" x2="320" x1="328" style={{ fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }}></line>
                </svg>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;