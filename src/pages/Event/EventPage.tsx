import Gallery from "../../components/Gallery/Gallery";
import styles from "./EventPage.module.css";
import { FaStar } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { BsFillGeoAltFill } from "react-icons/bs";
import { TfiTicket } from "react-icons/tfi";

import Dropdown from "../../components/UI/Dropdown/Dropdown";
import Booking from "../../components/Booking/Booking";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader/PageLoader";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Reviews from "../../components/Reviews/Reviews";

interface EventFeature {
  title: string;
  feature_img: string;
}

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
  image_urls: string[];
  duration: string;
  included_features: string;
  is_help: string;
  full_description: string;
  features: EventFeature[];
}

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    setLoading(true);
    const start = Date.now();

    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      console.log(data.event);
      if (data.success) {
        const eventData = data.event;
        if (typeof eventData.image_urls === "string") {
          eventData.image_urls = JSON.parse(eventData.image_urls);
        }
        setEvent(eventData);
      } else {
        setEvent(null);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setEvent(null);
    } finally {
      // Подсчёт прошедшего времени
      const elapsed = Date.now() - start;
      const minDelay = 2000; // 2 секунды
      const remaining = Math.max(0, minDelay - elapsed);

      // Гарантируем минимум 2 секунды загрузки
      setTimeout(() => setLoading(false), remaining);
    }
  };

  const includedFeatures = event?.included_features
    ? event.included_features.split(",")
    : [];

  return (
    <main>
      <div className="container">
        {event ? (
          <>
            <ul className={styles.route}>
              <li>United Arab Emirates</li>
              <li>Dubai</li>
              <li>{event.location}</li>
              <li>{event.title}</li>
            </ul>

            <Gallery images={event.image_urls} />

            <section className={styles.info}>
              <div>
                <div className={styles.info__review}>
                  <span className={styles.rating}>
                    <FaStar color="gold" size={16} />
                  </span>
                  <span className={styles.rating__value}>{event.rating}</span>
                  <span className={styles.reviews__amount}>
                    {event.reviews_count} reviews
                  </span>
                </div>

                <p className={styles.bestseller}>Bestseller</p>
                <h1 className={styles.title}>{event.title}</h1>
                <p className={styles.description}>{event.description}</p>

                <Booking
                  ticketPrices={{
                    adult: event.price,
                    child: Number((event.price - event.price * 0.2).toFixed(2)),
                  }}
                  price={event.price}
                  no_discount={event.no_discount}
                  is_help={event.is_help}
                  feature={event.features}
                />
                {event.is_help === "TRUE" && (
                  <div>
                    <HowItWorks />
                    <div className={styles.description__full}>
                      <p className={styles.description__full__title}>
                        Description
                      </p>
                      <p
                        className={styles.desc}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {event.full_description}
                      </p>
                    </div>
                    <div>
                      <p className={styles.map__title}>How to get there</p>
                      <iframe
                        className={styles.map}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1786541102924!2d55.27180147516347!3d25.197196977710906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2z0JHRg9GA0LTQti3QpdCw0LvQuNGE0LA!5e0!3m2!1sru!2scz!4v1761176179041!5m2!1sru!2scz"
                        width="792"
                        height="528"
                        style={{ border: "0" }}
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                )}
                {event.is_help === "FALSE" && (
                  <div className={styles.dropdowns}>
                    <Dropdown is_open={true} title="What's included">
                      <div className={styles.included__content}>
                        <span>Included</span>
                        {includedFeatures.map((feature, index) => (
                          <div key={index}>
                            <FaCheck size={20} color="#00806f" />
                            {feature.trim()}
                          </div>
                        ))}
                      </div>
                    </Dropdown>

                    <Dropdown title="Description">
                      <p style={{ whiteSpace: "pre-line" }}>
                        {event.full_description}
                      </p>
                    </Dropdown>

                    <Dropdown title="How to get there">
                      <div className={styles.address}>
                        <div className={styles.row}>
                          <div className={styles.column}>
                            <BsFillGeoAltFill size={24} />
                          </div>
                          <div className={styles.column}>
                            {event.location}
                            <span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  event.location
                                )}`}
                              >
                                View on Google Maps
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Dropdown>

                    <Dropdown title="Additional info">
                      <div className={styles.additional}>
                        <div className={styles.row}>
                          <div className={styles.column}>
                            <TfiTicket size={24} />
                          </div>
                          <div className={styles.column}>
                            <span>Provider: Tiqets International B.V.</span>
                            <span>
                              Registered address: James Wattstraat 77-P, 1097
                              DL, Amsterdam, NL Reach out to the Tiqets Help
                              Center, we act as a contact on behalf of the
                              activity supplier
                            </span>
                          </div>
                        </div>
                      </div>
                    </Dropdown>

                    <Dropdown title="Reschedule and cancellation policy">
                      <ul className={styles.policy}>
                        <li>This ticket is refundable</li>
                        <li>Rescheduling is possible for this ticket</li>
                      </ul>
                    </Dropdown>
                  </div>
                )}
              </div>
              <Reviews />
            </section>
          </>
        ) : (
          !loading && <div className="container">Event not found</div>
        )}
      </div>
      {loading && <PageLoader />}
    </main>
  );
};

export default EventPage;
