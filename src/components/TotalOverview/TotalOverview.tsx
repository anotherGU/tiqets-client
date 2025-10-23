// TotalOverview.tsx
import { useEffect } from "react";
import { useBooking } from "../../context/BookingContext";
import styles from "./TotalOverview.module.css";

interface TotalOverviewProps {
  onNextStep?: (e?: React.FormEvent) => void;
  isPaymentStep?: boolean;
  userData?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode?: string;
  };
  isReadOnly?: boolean; // 👈 добавлено
  event?: string[];
}

const TotalOverview = ({
  onNextStep,
  isPaymentStep = false,
  userData,
  isReadOnly = false,
  event, // 👈 по умолчанию false
}: TotalOverviewProps) => {
  const { bookingData } = useBooking();

  if (!bookingData) {
    return (
      <div className={styles.overview}>
        <h2>Your tickets overview</h2>
        <p>No booking data available. Please start a new booking.</p>
      </div>
    );
  }

  const { date, tickets, totalPrice, ticketPrices, originalPrice } =
    bookingData;

  const adultPrice = ticketPrices?.adult || 48;
  const childPrice = ticketPrices?.child || 38;

  const calculateOriginalTotal = (): number => {
    if (originalPrice) {
      const totalTickets = tickets.adult + tickets.child;
      return originalPrice * totalTickets;
    }
    return tickets.adult * 48 + tickets.child * 38;
  };

  const originalTotal = calculateOriginalTotal();
  const savings = originalTotal - totalPrice;

  const handleClick = (e: React.MouseEvent) => {
    if (onNextStep) {
      if (isPaymentStep) {
        onNextStep();
      } else {
        onNextStep(e as unknown as React.FormEvent);
      }
    }
  };

  useEffect(() => {
    console.log(event);
  }, []);

  return (
    <>
      <h2 className={styles.overview}>Your tickets overview</h2>

      <div className={`${styles.total} ${isReadOnly ? styles.readOnly : ""}`}>
        <div className={styles.total__header}>
          <div className={styles.header__img}>
            <img width={80} height={80} src={event?.[0]} alt="Event" />
          </div>
          <p className={styles.header__title}>
            Burj Khalifa: Level 124/125 Fast Track
          </p>
          <p className={styles.header__date}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path d="M20.4 3.024H18V2.4a1.2 1.2 0 1 0-2.4 0v.624H8.4V2.4a1.2 1.2 0 0 0-2.4 0v.624H3.6a2.4 2.4 0 0 0-2.4 2.4V20.4a2.4 2.4 0 0 0 2.4 2.4h16.8a2.4 2.4 0 0 0 2.4-2.4V5.424a2.4 2.4 0 0 0-2.4-2.4z" />
            </svg>
            {date}
          </p>
          <div className={styles.refundable}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path d="M20.925 18.063 4.386 1.525c.033-.002.06-.019.093-.019h4.174a3.348 3.348 0 1 0 6.695 0h4.175a1.402 1.402 0 0 1 1.402 1.403v15.154Zm-17.848 3.03a1.403 1.403 0 0 0 1.402 1.402h4.174a3.348 3.348 0 0 1 6.695 0h4.175c.032 0 .06-.016.092-.019L3.077 5.938v15.155Zm19.688.54L2.37 1.236A.8.8 0 1 0 1.236 2.37l20.397 20.396a.802.802 0 0 0 1.133-1.132Z"></path>
            </svg>
            Refundable
          </div>
        </div>

        <div className={styles.total__body}>
          <div className={styles.adults}>
            <div className={styles.eminem}>
              <p className={styles.quantity}>{tickets.adult}</p>
              <p>Adult (AED {adultPrice.toFixed(2)})</p>
            </div>
            <p className={styles.amount}>
              AED {(tickets.adult * adultPrice).toFixed(2)}
            </p>
          </div>

          <div className={styles.child}>
            <div className={styles.eminem}>
              <p className={styles.quantity}>{tickets.child}</p>
              <p>Child (AED {childPrice.toFixed(2)})</p>
            </div>
            <p className={styles.amount}>
              AED {(tickets.child * childPrice).toFixed(2)}
            </p>
          </div>
        </div>

        <div className={styles.originalTotal}>
          <p>Price without discount</p>
          <p className={styles.originalAmount}>
            AED {originalTotal.toFixed(2)}
          </p>
        </div>

        {savings > 0 && (
          <div className={styles.savings}>
            <p>Your savings</p>
            <p className={styles.savingsAmount}>-AED {savings.toFixed(2)}</p>
          </div>
        )}

        <div className={styles.total__footer}>
          <p>Total</p>
          <p>AED {totalPrice.toFixed(2)}</p>
        </div>
      </div>

      {userData && userData.firstName && (
        <div className={styles.userInfo}>
          <p>
            <strong>
              {userData.firstName} {userData.lastName}
            </strong>
          </p>
          <p>
            {userData.countryCode || ""} {userData.phoneNumber}
          </p>
        </div>
      )}

      {savings > 0 && (
        <div className={styles.savingsBlock}>
          <div className={styles.savingsContent}>
            <p>
              <strong>Nice!</strong> You saved{" "}
              <span style={{ color: "red" }}>AED {savings.toFixed(2)}</span>
            </p>
            <img
              src="/assets/free-icon-party-poppers-18655126.png"
              alt="confetti"
              className={styles.savingsIcon}
            />
          </div>
        </div>
      )}

      {/* 👇 Кнопка скрыта в режиме ReadOnly */}
      {!isReadOnly && (
        <div className={styles.next}>
          <div>
            <h2>Total price</h2>
            <h2>AED {totalPrice.toFixed(2)}</h2>
          </div>
          <button
            className={styles.next__btn}
            onClick={handleClick}
            type="button"
          >
            {isPaymentStep ? "Complete Payment" : "Go to the next step"}
          </button>
        </div>
      )}
    </>
  );
};

export default TotalOverview;
