import React from "react";
import styles from "./Reviews.module.css";

const reviews = [
  {
    name: "Anna",
    date: "August 10, 2025",
    rating: 5,
    text: "Incredible view! Totally worth it. Everything was smooth and well-organized.",
  },
  {
    name: "Mark",
    date: "June 2, 2025",
    rating: 4,
    text: "A bit crowded, but the experience was amazing overall!",
  },
  {
    name: "Sophia",
    date: "May 14, 2025",
    rating: 5,
    text: "Loved the sunset view from the top! Staff were very kind and helpful.",
  },
  {
    name: "Liam",
    date: "March 19, 2025",
    rating: 3,
    text: "Nice experience, but long waiting time despite fast-track ticket.",
  },
  {
    name: "Olivia",
    date: "January 8, 2025",
    rating: 5,
    text: "Absolutely stunning! Highly recommend going early morning.",
  },
  {
    name: "Noah",
    date: "April 23, 2025",
    rating: 4,
    text: "The view was breathtaking, though the glass reflection made photos tricky.",
  },
  {
    name: "Emma",
    date: "July 1, 2025",
    rating: 2,
    text: "Too expensive for what it offers.",
  },
  {
    name: "Ethan",
    date: "September 2, 2025",
    rating: 1,
    text: "The weather was bad and visibility was poor.",
  },
    {
    name: "John",
    date: "September 10, 2025",
    rating: 3,
    text: "Was nice",
  },
    {
    name: "Alex",
    date: "September 14, 2025",
    rating: 5,
    text: "Liked so much",
  },
    {
    name: "Anna",
    date: "September 21, 2025",
    rating: 4,
    text: "Ok",
  },
    {
    name: "Ethan",
    date: "September 27, 2025",
    rating: 5,
    text: "The most beatiful place where i ever was",
  },
    {
    name: "John",
    date: "September 29, 2025",
    rating: 3,
    text: "Very cool, but weather was poor",
  },
    {
    name: "Kate",
    date: "September 2, 2025",
    rating: 5,
    text: "",
  },
];

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
          <span className={styles.averageValue}>{average}</span>
          <span className={styles.stars}>
            {"★".repeat(Math.round(Number(average)))}
            {"☆".repeat(5 - Math.round(Number(average)))}
          </span>
          <span className={styles.total}>{totalReviews} reviews</span>
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
