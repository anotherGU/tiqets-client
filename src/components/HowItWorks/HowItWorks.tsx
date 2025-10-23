import React from "react";
import styles from "./HowItWorks.module.css";

const HowItWorks: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>How it works</h2>

      <div className={styles.step}>
        <div className={styles.icon}>1</div>
        <div>
          <h3 className={styles.subtitle}>Pick your visit dates</h3>
          <p className={styles.text}>
            Select your visit dates and number of participants
          </p>
        </div>
      </div>

      <div className={styles.line}></div>

      <div className={styles.step}>
        <div className={styles.icon}>2</div>
        <div>
          <h3 className={styles.subtitle}>Customize your package</h3>
          <p className={styles.text}>
            Pick from a wide selection of tickets that best suit your interests
          </p>
        </div>
      </div>

      <div className={styles.line}></div>

      <div className={styles.step}>
        <div className={styles.icon}>3</div>
        <div>
          <h3 className={styles.subtitle}>Get your tickets</h3>
          <p className={styles.text}>Download digital tickets after payment.</p>
        </div>
      </div>

      <div className={styles.line}></div>

      <div className={styles.step}>
        <div className={`${styles.icon} ${styles.gift}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-labelledby="icon-q3DRW30aj93yXAnBVJUQU"
            className="flex fill-current stroke-current stroke-0 duration-150 ease-in-out"
            width="15"
            height="15"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M21.778 7.674h-2.445c.303-.46.527-.968.66-1.503a4.362 4.362 0 0 0-.83-3.667 4.118 4.118 0 0 0-3.276-1.503A5.11 5.11 0 0 0 12 2.785a5.11 5.11 0 0 0-3.887-1.784 4.119 4.119 0 0 0-3.3 1.564 4.314 4.314 0 0 0-.819 3.667c.138.516.366 1.005.673 1.442H2.222A1.222 1.222 0 0 0 1 8.896v1.882a1.222 1.222 0 0 0 1.222 1.223h8.556V7.723h-.465C8.42 7.564 6.72 7.112 6.366 5.609a1.906 1.906 0 0 1 .366-1.565 1.687 1.687 0 0 1 1.381-.599 2.664 2.664 0 0 1 2.665 2.616V5.89v1.76h2.444V5.902v.171a2.664 2.664 0 0 1 2.665-2.628 1.687 1.687 0 0 1 1.38.636 1.908 1.908 0 0 1 .367 1.564c-.354 1.516-2.053 1.956-4.008 2.066h-.404V12h8.556A1.222 1.222 0 0 0 23 10.778V8.896a1.222 1.222 0 0 0-1.222-1.222zM2.858 20.556A2.444 2.444 0 0 0 5.302 23h5.476v-9.777h-7.92zM13.222 23h5.476a2.445 2.445 0 0 0 2.444-2.444v-7.333h-7.92z"></path>
          </svg>
        </div>
        <div>
          <h3 className={styles.subtitle}>
            Personal gift — <span className={styles.bold}>10% off</span> your
            next 5 bookings in Dubai
          </h3>
          <p className={styles.text}>Save on top attractions including:</p>
          <ul className={styles.list}>
            <li>Aquaventure World</li>
            <li>Dubai Miracle Garden</li>
            <li>Sky Views Observatory</li>
            <li>Dubai Cruises</li>
            <li>Museum of the Future</li>
            <li>and many more in Dubai</li>
          </ul>
          <p className={styles.text}>
            Just use the personal discount code sent via email after your
            purchase. This code is valid for one month on bookings in Dubai.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
