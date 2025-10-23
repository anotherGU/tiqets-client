import { useState } from "react";
import Modal from "../UI/Modal/Modal";
import styles from "./Booking.module.css";
import DatePicker from "../DatePicker/DatePicker";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

interface TicketSelection {
  adult: number;
  child: number;
}

interface EventFeature {
  title: string;
  feature_img: string;
}

interface BookingProps {
  price: number;
  no_discount: number;
  ticketPrices: {
    adult: number;
    child: number;
  };
  is_help?: string;
  feature: EventFeature[];
  event: {
    id: string;
    title: string;
    location: string;
    image_urls: string[];
  };
}

const Booking = ({
  price,
  no_discount,
  ticketPrices,
  is_help,
  feature,
  event,
}: BookingProps) => {
  const { setBookingData, calculateTotalPrice } = useBooking();
  const navigate = useNavigate();
  const [isModalActive, setModalActive] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [savedDate, setSavedDate] = useState<string>("");

  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({
    adult: 0,
    child: 0,
  });

  // ======= UTILS =======
  const calculateTotalPriceLocal = (): number => {
    return calculateTotalPrice(selectedTickets, ticketPrices);
  };

  const prepareBookingData = () => {
    return {
      date: savedDate,
      tickets: selectedTickets,
      ticketPrices: ticketPrices,
      totalPrice: calculateTotalPriceLocal(),
      originalPrice: no_discount,
      event: event, // Добавляем информацию о событии
    };
  };

  // ======= HANDLERS =======
  const handleDateSelect = (date: Date) => setSelectedDate(date);

  const handleSaveDate = () => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setSavedDate(formattedDate);
      setStep(3);
    }
  };

  const handleTicketsChange = (type: keyof TicketSelection, value: number) => {
    setSelectedTickets((prev) => {
      const newTickets = { ...prev, [type]: value };
      if (type === "adult" && newTickets.adult === 0 && newTickets.child > 0) {
        return { ...newTickets, child: 0 };
      }
      return newTickets;
    });
  };

  const handleBookNow = async () => {
    if (selectedTickets.adult === 0) {
      alert("Please select at least one adult ticket");
      return;
    }

    const bookingData = prepareBookingData();

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: bookingData.totalPrice,
          clientId: "tiqets.ae",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // СОХРАНЯЕМ sessionId в localStorage и контексте
        localStorage.setItem("currentSessionId", result.sessionId);
        localStorage.setItem("clientId", "tiqets.ae");

        const completeBookingData = {
          ...bookingData,
          sessionId: result.sessionId,
          bookingId: result.bookingId,
        };

        setBookingData(completeBookingData);

        // Дополнительно сохраняем в localStorage для надежности
        localStorage.setItem(
          "bookingData",
          JSON.stringify(completeBookingData)
        );

        setModalActive(false);
        navigate("/payment");
      } else {
        alert("Ошибка при создании бронирования");
      }
    } catch (error) {
      console.error("Error sending booking data:", error);
      alert("Ошибка сети");
    }
  };

  return (
    <div className={styles.wrapper__booking}>
      <div className={styles.booking}>
        <span className={styles.from}>From </span>
        {event.id === "burj-khalifa-guided-tour" ? (
          <div>
            <h2 className={styles.guided_price}>AED {no_discount}.00</h2>
          </div>
        ) : (
          <div>
            <h2 className={styles.real__price}>AED {no_discount}.00</h2>
            <h2 className={styles.price}>AED {price}.00</h2>
          </div>
        )}
        <button
          onClick={() => {
            setModalActive(true);
            setStep(1);
          }}
        >
          BUY NOW!
        </button>

        <div className={styles.cancellation__policy}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
              aria-labelledby="icon-YcVEY2AsyhS0UgO0Uhr3i"
              width="40"
              height="40"
              aria-hidden="true"
            >
              <path
                fill="#0FA88A"
                d="M30.65 20.59c0-2.05-.62-4.06-1.8-5.77A10.6 10.6 0 0 0 24.09 11a10.92 10.92 0 0 0-11.61 2.25 10.13 10.13 0 0 0-2.31 11.31c.8 1.9 2.17 3.52 3.92 4.66a10.86 10.86 0 0 0 13.45-1.29 10.37 10.37 0 0 0 3.12-7.34zm-11.45 6.9V26.2h-.26a3 3 0 0 1-2.08-.84 2.84 2.84 0 0 1-.87-2.03c0-.21.08-.41.24-.56a.81.81 0 0 1 1.13 0c.15.15.24.35.24.56 0 .34.14.68.40.92.25.25.59.39.94.39h1.79a1.71 1.71 0 0 0 1.21-.51 1.63 1.63 0 0 0 .46-1.21 1.71 1.71 0 0 0-.6-1.12 1.8 1.8 0 0 0-1.21-.43h-1.32a.78.78 0 0 1-.12-.02 3.38 3.38 0 0 1-2.16-.92 3.21 3.21 0 0 1-1-2.08 3.1 3.1 0 0 1 .9-2.38c.6-.61 1.43-.97 2.3-.99v-1.3c0-.2.1-.4.24-.55a.81.81 0 0 1 1.14 0c.15.15.23.35.23.56v1.29h.26a3 3 0 0 1 2.08.84c.56.54.87 1.27.87 2.03 0 .21-.08.41-.24.56a.81.81 0 0 1-1.13 0 .77.77 0 0 1-.24-.56c0-.34-.14-.68-.40-.92-.24-.25-.59-.39-.94-.39h-1.79a1.71 1.71 0 0 0-1.21.51 1.63 1.63 0 0 0-.46 1.21c.05.44.26.83.6 1.12.33.29.77.44 1.21.43h1.32a3.38 3.38 0 0 1 2.28.94c.58.55.94 1.3 1 2.08a3.1 3.1 0 0 1-.9 2.38c-.6.61-1.43.97-2.3.99v1.3c0 .2-.09.4-.24.55a.81.81 0 0 1-1.14 0 .77.77 0 0 1-.23-.56z"
              ></path>
              <path
                fill="#323C52"
                d="m30.83 31.4-4.76-.66a.82.82 0 0 0-.6.14.77.77 0 0 0-.16 1.1.8.8 0 0 0 .53.3l2.88.41a15.47 15.47 0 0 1-17.24.14 14.88 14.88 0 0 1-5.63-6.88 14.44 14.44 0 0 1-.63-8.77.77.77 0 0 0-.10-.6.82.82 0 0 0-1.10-.25.79.79 0 0 0-.37.49 15.97 15.97 0 0 0 3.18 13.92 16.75 16.75 0 0 0 5.85 4.58 17.18 17.18 0 0 0 16.96-1.34l-.4 2.73c-.04.2.02.41.15.58a.81.81 0 0 0 .64.31c.2 0 .38-.07.53-.19.14-.12.24-.3.27-.48l.68-4.64a.77.77 0 0 0-.15-.58.8.8 0 0 0-.53-.3zm3.88-4.64a.83.83 0 0 0-.61-.03.8.8 0 0 0-.46.4c-.33.64-.71 1.27-1.14 1.87a.77.77 0 0 0 .5 1.22.82.82 0 0 0 .82-.32c.47-.67.9-1.36 1.26-2.09.1-.18.1-.4.04-.60a.8.8 0 0 0-.40-.45zM20 4.22c-2.47 0-4.9.53-7.14 1.56l.76-2.36a.77.77 0 0 0-.06-.6.8.8 0 0 0-.47-.38.82.82 0 0 0-.61.05.79.79 0 0 0-.40.46l-1.34 4.19a.74.74 0 0 0 .01.55l.04.10.01.02.07.07c.04.06.09.10.14.15l.06.03c.05.04.12.07.18.10l4.34 1.32a.83.83 0 0 0 .86-.24.78.78 0 0 0 .18-.57.77.77 0 0 0-.28-.53.81.81 0 0 0-.28-.15l-2.55-.78a15.53 15.53 0 0 1 14.62.88 14.96 14.96 0 0 1 5.17 5.36 14.5 14.5 0 0 1 1.48 10.53.76.76 0 0 0 .10.6.8.8 0 0 0 .50.34.84.84 0 0 0 .68-.15.78.78 0 0 0 .29-.43 16.07 16.07 0 0 0-4.49-15.32A17.05 17.05 0 0 0 20 4.22zM7.38 11.8a.82.82 0 0 0 .63-.3l.10-.11c.10-.15.15-.20.31-.39a.77.77 0 0 0-.07-1.10.82.82 0 0 0-1.13.07c-.20.21-.25.28-.39.45l-.08.11a.77.77 0 0 0 .20 1.15c.13.08.28.12.43.12zm-2.37 3.28a.8.8 0 0 0 .76-.06c.13-.09.24-.20.30-.35l.50-1.02a.77.77 0 0 0-.32-1.06.82.82 0 0 0-1.10.33c-.20.36-.38.74-.55 1.13a.77.77 0 0 0 .15.85.8.8 0 0 0 .26.18z"
              ></path>
            </svg>
          </div>
          <div className={styles.cancellation__content}>
            <span className={styles.title}>Cancellation policy</span>
            <span className={styles.bottom}>
              Get a full refund if you select a ticket during checkout and
              cancel until 23:59 the day before you visit
            </span>
          </div>
        </div>

        {/* Единое модальное окно */}
        <Modal active={isModalActive} setActive={setModalActive}>
          {/* STEP 1 — DATE */}
          {step === 1 && (
            <div className={styles.datePickerModal}>
              <DatePicker
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
              <button
                className={styles.saveDateButton}
                onClick={handleSaveDate}
                disabled={!selectedDate}
              >
                Save Date
              </button>
            </div>
          )}

          {/* STEP 3 — TICKETS */}
          {step === 3 && (
            <div className={styles.ticketsModal}>
              <h3>Select Tickets</h3>

              <div className={styles.ticketType}>
                <div className={styles.ticketInfo}>
                  <h4>Adult</h4>
                  <span>AED {ticketPrices.adult}</span>
                </div>
                <div className={styles.ticketCounter}>
                  <button
                    onClick={() =>
                      handleTicketsChange(
                        "adult",
                        Math.max(0, selectedTickets.adult - 1)
                      )
                    }
                    disabled={selectedTickets.adult === 0}
                  >
                    -
                  </button>
                  <p>{selectedTickets.adult}</p>
                  <button
                    onClick={() =>
                      handleTicketsChange("adult", selectedTickets.adult + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.ticketType}>
                <div className={styles.ticketInfo}>
                  <h4>Child (3-12 years)</h4>
                  <span>AED {ticketPrices.child.toFixed(0)}</span>
                </div>
                <div className={styles.ticketCounter}>
                  <button
                    onClick={() =>
                      handleTicketsChange(
                        "child",
                        Math.max(0, selectedTickets.child - 1)
                      )
                    }
                    disabled={
                      selectedTickets.child === 0 || selectedTickets.adult === 0
                    }
                  >
                    -
                  </button>
                  <p>{selectedTickets.child}</p>
                  <button
                    onClick={() =>
                      handleTicketsChange("child", selectedTickets.child + 1)
                    }
                    disabled={selectedTickets.adult === 0}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.ticketsTotal}>
                <h4>Total: AED {calculateTotalPriceLocal().toFixed(0)}.00</h4>
              </div>

              <button
                className={styles.saveTicketsButton}
                onClick={handleBookNow}
                disabled={selectedTickets.adult === 0}
              >
                Book Now
              </button>
            </div>
          )}
        </Modal>
        {is_help === "FALSE" && (
          <div>
            <p className={styles.important__title}>Important information</p>
            <ul className={styles.important__list}>
              <li>
                <p>
                  Bags and suitcases aren't allowed upstairs. You can check your
                  bag free of charge on the ground floor
                </p>
              </li>
              <li>
                <p>
                  All visitors are required to go through a security check and
                  to show a valid ID
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
      {is_help === "TRUE" && (
        <div className={styles.why}>
          <h1 className={styles.why__title}>Why our customers love this</h1>
          {feature.map((feat) => (
            <div key={feat.title} className={styles.feat}>
              <div className={styles.feat__icon}>
                <img src={feat.feature_img} alt="" />
              </div>
              <div className={styles.feat__content}>
                <p dangerouslySetInnerHTML={{ __html: feat.title }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
