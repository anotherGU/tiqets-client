import React from "react";
import styles from "./Reviews.module.css";

import { reviews } from "./Reviews";

const Reviews = () => {
  const randomReviews = React.useMemo(
    () => reviews.sort(() => 0.5 - Math.random()).slice(0, 5),
    []
  );

  // --- Подсчёт статистики по оценкам ---
  const ratingCounts = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => counts[r.rating - 1]++);
    return counts;
  }, []);

  const totalReviews = reviews.length;
  const average = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  return (
    <section className={styles.reviewsSection}>
      <h2>Ratings & Reviews</h2>

      {/* --- Блок статистики рейтингов --- */}
      <div className={styles.ratingSummary}>
        <div className={styles.average}>
          <span className={styles.averageValue}>4.5</span>
          <span className={styles.stars}>
            {"★".repeat(Math.round(Number(average)))}
            {"☆".repeat(5 - Math.round(Number(average)))}
          </span>
          <span className={styles.total}>4156 reviews</span>
        </div>

        <div className={styles.bars}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star - 1];
            const percent = ((count / totalReviews) * 100).toFixed(0);
            return (
              <div key={star} className={styles.barRow}>
                <span className={styles.starLabel}>{star}★</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className={styles.percent}>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Список отзывов --- */}
      {randomReviews.map((r, i) => (
        <div key={i} className={styles.review}>
          <div className={styles.header}>
            <div className={styles.name}>{r.name}</div>
            <div className={styles.date}>{r.date}</div>
          </div>
          <div className={styles.rating}>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>
          <p className={styles.text}>{r.text}</p>
        </div>
      ))}
    </section>
  );
};

export default Reviews;
