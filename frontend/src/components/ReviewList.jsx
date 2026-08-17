function ReviewList({ reviews, onDeleteReview }) {
  if (!reviews || reviews.length === 0) {
    return <p className="reviews-empty">Aún no hay reseñas para esta película. ¡Sé el primero en opinar!</p>;
  }

  return (
    <div className="reviews-list">
      {reviews.map((rev) => (
        <div key={rev.id} className="review-card">
          <div className="review-header">
            <strong className="review-author">{rev.author}</strong>
            <span className="review-score">⭐ {rev.score} / 5</span>
          </div>
          <p className="review-comment">{rev.comment}</p>
          <button
            onClick={() => onDeleteReview(rev.id)}
            className="review-delete-btn"
          >
            Eliminar reseña
          </button>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;