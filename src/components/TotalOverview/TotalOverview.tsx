// TotalOverview.tsx
import { useBooking } from "../../context/BookingContext";
import styles from "./TotalOverview.module.css";

interface TotalOverviewProps {
  onNextStep?: (e?: React.FormEvent) => void;
  isPaymentStep?: boolean;
}

const TotalOverview = ({ onNextStep, isPaymentStep = false }: TotalOverviewProps) => {
  const { bookingData } = useBooking();

  if (!bookingData) return <p>No booking data available.</p>;

  const { date, time, tickets, totalPrice } = bookingData;

  const handleClick = (e: React.MouseEvent) => {
    if (onNextStep) {
      if (isPaymentStep) {
        onNextStep();
      } else {
        onNextStep(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <>
      <h2 className={styles.overview}>Your tickets overview</h2>
      <div>
        <div className={styles.total}>
          <div className={styles.total__header}>
            <div className={styles.header__img}>
              <img
                width={80}
                height={80}
                src="./assets/gallery/2a3f6b35b65e4a1b90f3cc0f7d556a33 (1).avif"
                alt=""
              />
            </div>
            <p className={styles.header__title}>
              Burj Khalifa: Level 124/125 Fast Track
            </p>
            <p className={styles.header__date}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-labelledby="icon-FcsWVRMw3nN7xIARI1og9"
                className="mr-2 shrink-0 self-start mt-0.5 fill-current stroke-current stroke-0 duration-150 ease-in-out"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20.4 3.024H18V2.4a1.2 1.2 0 1 0-2.4 0v.624H8.4V2.4a1.2 1.2 0 0 0-2.4 0v.624H3.6a2.4 2.4 0 0 0-2.4 2.4V20.4a2.4 2.4 0 0 0 2.4 2.4h16.8a2.4 2.4 0 0 0 2.4-2.4V5.424a2.4 2.4 0 0 0-2.4-2.4zm.576 6.576v10.176a1.2 1.2 0 0 1-1.2 1.2h-15.6a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h15.6a1.2 1.2 0 0 1 1.2 1.2z"></path>
                <path d="M11.1 10.2H9.3V12h1.8zM11.1 13.788H9.3v1.8h1.8zM11.1 17.388H9.3v1.8h1.8zM14.7 10.2h-1.8V12h1.8zM14.7 13.788h-1.8v1.8h1.8zM14.7 17.388h-1.8v1.8h1.8zM18.288 10.2h-1.8V12h1.8zM18.288 13.788h-1.8v1.8h1.8zM7.512 13.788h-1.8v1.8h1.8zM7.512 17.388h-1.8v1.8h1.8z"></path>
              </svg>
              {date}
            </p>
            <p className={styles.header__time}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-labelledby="icon-FkbUbdMRFguwH1hDN_Vpf"
                className="mr-2 fill-current stroke-current stroke-0 duration-150 ease-in-out"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm.917 11.11a.917.917 0 0 1-.917.917H7.001a.917.917 0 0 1 0-1.834h4.082V4.667a.917.917 0 0 1 1.834 0z"></path>
              </svg>
              {time?.time}
            </p>
            <div className={styles.refundable}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-labelledby="icon-za82L4iZY5V1th8XYqKO2"
                className="mr-2 fill-current stroke-current stroke-0 duration-150 ease-in-out"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
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
                <p>Adult (AED {time?.price}.00)</p>
              </div>
                <p className={styles.amount}> AED {tickets.adult * (time?.price || 0)}.00</p>
            </div>
            <div className={styles.child}>
              <div className={styles.eminem}>
                <p className={styles.quantity}>{tickets.child}</p>
                <p>Child (AED 48.00)</p>
              </div>
              <p className={styles.amount}> AED {tickets.child * 49}.00</p>
            </div>
          </div>
          <div className={styles.total__footer}>
            <p>Price</p>
            <p> AED {totalPrice}.00</p>
          </div>
        </div>
        <div className={styles.next}>
          <div>
            <h2>Total price</h2>
            <h2>AED {totalPrice}.00</h2>
          </div>
          <button 
            className={styles.next__btn} 
            onClick={handleClick}
            type="button"
          >
            {isPaymentStep ? "Complete Payment" : "Go to the next step"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TotalOverview;