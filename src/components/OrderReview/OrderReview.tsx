import React, { useState } from "react";
import styles from "./OrderReview.module.css";
import { useBooking } from "../../context/BookingContext";
import { useNavigate } from "react-router-dom";
import TotalOverview from "../../components/TotalOverview/TotalOverview";
import { Calendar, ChevronDown, Users } from "lucide-react";

interface OrderReviewProps {
  onConfirm: () => void;
}

const OrderReview: React.FC<OrderReviewProps> = ({ onConfirm }) => {
  const { bookingData, setBookingData } = useBooking();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTicketSelector, setShowTicketSelector] = useState(false);

  if (!bookingData || !bookingData.event) {
    return (
      <div className={styles.empty}>
        <h2>No booking data found</h2>
        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    );
  }

  const { date, tickets, ticketPrices, event } = bookingData;
  const { title, image_urls } = event;

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();

    const formatted = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return isToday ? `${formatted} (Today)` : formatted;
  };

  const handleDateChange = (newDate: string) => {
    const updatedBookingData = {
      ...bookingData,
      date: newDate,
    };

    setBookingData(updatedBookingData);
    // Также обновляем localStorage
    localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));
    setShowDatePicker(false);
  };

  const handleTicketChange = (type: "adult" | "child", delta: number) => {
    const newTickets = {
      ...tickets,
      [type]: Math.max(0, tickets[type] + delta),
    };

    if (type === "adult" && newTickets.adult === 0) {
      return;
    }

    const newTotalPrice =
      newTickets.adult * ticketPrices.adult +
      newTickets.child * ticketPrices.child;

    const updatedBookingData = {
      ...bookingData,
      tickets: newTickets,
      totalPrice: newTotalPrice,
    };

    console.log("Updating booking data:", updatedBookingData);
    setBookingData(updatedBookingData);

    // КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: обновляем localStorage СРАЗУ
    localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        {/* EVENT CARD */}
        <div className={styles.eventCard}>
          <div className={styles.eventInfo}>
            <h2 className={styles.eventTitle}>{title}</h2>
            <button className={styles.moreInfoBtn}>Show more info ⓘ</button>
          </div>
          <img
            src={image_urls?.[0] || "/assets/placeholder.jpg"}
            alt={title}
            className={styles.eventImage}
          />
        </div>

        {/* WHEN WILL YOU VISIT */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>When will you visit?</h3>

          <div className={styles.dateTimeItem}>
            <div
              className={styles.dropdown}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <div className={styles.dropdownIcon}>
                <Calendar size={18} />
              </div>
              <span>{date ? formatDate(date) : "Select date"}</span>
              <ChevronDown size={18} className={styles.chevron} />
            </div>

            {showDatePicker && (
              <div className={styles.datePicker}>
                {generateDateOptions().map((dateOption) => (
                  <div
                    key={dateOption}
                    className={`${styles.dateOption} ${
                      date === dateOption ? styles.dateOptionActive : ""
                    }`}
                    onClick={() => handleDateChange(dateOption)}
                  >
                    {formatDate(dateOption)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SELECT TICKETS */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Select your tickets</h3>

          <div className={styles.infoBox}>
            <ul>
              <li>Infants (0-2) are free of charge</li>
            </ul>
          </div>

          {/* Ticket Selector Toggle */}
          <div
            className={styles.dropdown}
            onClick={() => setShowTicketSelector(!showTicketSelector)}
            style={{ marginTop: "16px" }}
          >
            <div className={styles.dropdownIcon}>
              <Users size={18} />
            </div>
            <span>
              {tickets.adult}x Adult
              {tickets.child > 0 ? `, ${tickets.child}x Child` : ""}
            </span>
            <ChevronDown size={18} className={styles.chevron} />
          </div>

          {/* Ticket Selection Panel */}
          {showTicketSelector && (
            <div className={styles.ticketPanel}>
              {/* Adult Ticket */}
              <div className={styles.ticketRow}>
                <div className={styles.ticketRowLeft}>
                  <h4 className={styles.ticketRowTitle}>Adult</h4>
                  <p className={styles.ticketRowAge}>Age: 8+</p>
                  <p className={styles.ticketRowPrice}>
                    AED {ticketPrices.adult}.00
                  </p>
                </div>
                <div className={styles.ticketRowRight}>
                  <button
                    className={styles.ticketBtn}
                    onClick={() => handleTicketChange("adult", -1)}
                    disabled={tickets.adult <= 1}
                  >
                    −
                  </button>
                  <span className={styles.ticketCount}>{tickets.adult}</span>
                  <button
                    className={styles.ticketBtn}
                    onClick={() => handleTicketChange("adult", 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Child Ticket */}
              <div className={styles.ticketRow}>
                <div className={styles.ticketRowLeft}>
                  <h4 className={styles.ticketRowTitle}>Child</h4>
                  <p className={styles.ticketRowAge}>Age: 3-7</p>
                  <p className={styles.ticketRowNote}>
                    Only in combination with: Adult
                  </p>
                  <p className={styles.ticketRowPrice}>
                    AED {ticketPrices.child}.00
                  </p>
                </div>
                <div className={styles.ticketRowRight}>
                  <button
                    className={styles.ticketBtn}
                    onClick={() => handleTicketChange("child", -1)}
                    disabled={tickets.child === 0}
                  >
                    −
                  </button>
                  <span className={styles.ticketCount}>{tickets.child}</span>
                  <button
                    className={styles.ticketBtn}
                    onClick={() => handleTicketChange("child", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - TOTAL OVERVIEW */}
      <div className={styles.right}>
        <TotalOverview onNextStep={onConfirm} />
      </div>
    </div>
  );
};

export default OrderReview;
