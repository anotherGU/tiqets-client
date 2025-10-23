// components/EventsList/EventsList.tsx
import { Link } from "react-router-dom";
import styles from "./EventsList.module.css";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  no_discount: number;
  price: number;
  rating: number;
  reviews_count: number;
  category: string;
  image_urls: string[]; // Теперь массив строк
}

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/event/${event.id}`}
          className={styles.eventCard}
        >
          <div className={styles.imageContainer}>
            <img
              src={event.image_urls[0]} // Берем первую картинку для превью
              alt={event.title}
              className={styles.eventImage}
            />
          </div>
          <div className={styles.eventInfo}>
            <h3 className={styles.eventTitle}>{event.title}</h3>
            <p className={styles.eventDescription}>{event.description}</p>
            <div className={styles.eventLocation}>
              <span>📍 {event.location}</span>
            </div>
            <div className={styles.eventRating}>
              <span>⭐ {event.rating}</span>
              <span>({event.reviews_count} reviews)</span>
            </div>
            <div className={styles.eventPrice}>
              <span className={styles.no_discount}>AED {event.no_discount}.00</span>
              <span className={styles.price}>AED {event.price}.00</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventsList;
