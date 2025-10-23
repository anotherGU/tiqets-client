import styles from "./Reviews.module.css";
import { reviews } from "./ReviewsData";

interface ReviewsProps {
  rating: number;
  count: number;
}

const Reviews = ({ rating, count }: ReviewsProps) => {
  // Каждый раз при загрузке страницы берём новые 5 случайных отзывов
  const randomReviews = reviews
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map((r) => ({
      ...r,
      likes: Math.floor(Math.random() * 8), // случайное число лайков 0–7
    }));

  const totalReviews = reviews.length;


  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <section className={styles.reviewsSection}>
      <h2 className={styles.title}>Ratings & reviews</h2>

      {/* --- Общая статистика --- */}
      <div className={styles.summaryBox}>
        <div className={styles.averageBox}>
          <div className={styles.averageValue}>{rating.toFixed(1)}</div>
          <div className={styles.stars}>
            {"★".repeat(Math.round(rating))}
            {"☆".repeat(5 - Math.round(rating))}
          </div>
          <p className={styles.total}>{count} verified customer reviews</p>
        </div>

        <div className={styles.bars}>
          {[5, 4, 3, 2, 1].map((star, i) => {
            const c = ratingCounts[i];
            const percent = totalReviews
              ? ((c / totalReviews) * 100).toFixed(0)
              : 0;
            return (
              <div key={star} className={styles.barRow}>
                <span className={styles.starLabel}>{star}</span>
                <div className={styles.bar}>
                  <div style={{ width: `${percent}%` }}></div>
                </div>
                <span className={styles.count}>{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 5 случайных отзывов --- */}
      {randomReviews.map((r, idx) => (
        <div key={idx} className={styles.reviewCard}>
          <div className={styles.avatar}>
            {r.name ? r.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className={styles.reviewContent}>
            <div className={styles.header}>
              <span className={styles.name}>{r.name || "Anonymous"}</span>
              <span className={styles.date}>{r.date} • Verified customer</span>
            </div>
            <div className={styles.rating}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            {r.text && <p className={styles.text}>{r.text}</p>}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Reviews;
