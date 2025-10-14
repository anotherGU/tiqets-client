import Gallery from "../../components/Gallery/Gallery";
import styles from "./Main.module.css";
import { FaStar } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { BsFillGeoAltFill } from "react-icons/bs";
import { TfiTicket } from "react-icons/tfi";

import Dropdown from "../../components/UI/Dropdown/Dropdown";
import Booking from "../../components/Booking/Booking";
import Reviews from "../../components/Reviews/Reviews";
import { useEffect, useState } from "react";
import Banner from "../../components/UI/Banner/Banner";

const Main = () => {
  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsBannerOpen(true);
  }, []);

  const handleCloseBanner = () => {
    setIsBannerOpen(false);
  };
  return (
    <main>
      <Banner
        isOpen={isBannerOpen}
        onClose={handleCloseBanner}
        imageUrl="/assets/main/hell_photo_2025-10-15_00-08-47.jpg" 
      />
      <div className="container">
        <ul className={styles.route}>
          <li> United Arab Emirates </li>
          <li> Dubai </li>
          <li>Burj Khalifa</li>
          <li> Burj Khalifa: Level 124/125 Ticket</li>
        </ul>
        <Gallery />
        <section className={styles.info}>
          <div className={styles.info__review}>
            <span className={styles.rating}>
              <FaStar color="gold" size={16} />
            </span>
            <span className={styles.rating__value}>4.4</span>
            <span className={styles.reviews__amount}>9412 reviews</span>
          </div>
          <p className={styles.bestseller}>Bestseller</p>
          <h1 className={styles.title}>
            Burj Khalifa: Level 124/125 Fast Track
          </h1>
          <p className={styles.description}>
            Take the high-speed elevator to Level 124 and use high-powered
            telescopes
          </p>
          <div className={styles.fastTrack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-labelledby="icon-zs0FtUx_RdQE-sCSNam8n"
              className="fill-current stroke-current stroke-0 duration-150 ease-in-out"
              width="24"
              height="24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19.826 9.644c-.136-.26-.348-.48-.61-.632s-.567-.232-.876-.229h-2.95L17.1 3.13a1.562 1.562 0 0 0-.085-1.14 1.705 1.705 0 0 0-.852-.816 1.832 1.832 0 0 0-1.166-.131 1.748 1.748 0 0 0-.988.597L4.317 12.715a1.5 1.5 0 0 0-.14 1.631c.137.26.35.479.612.631s.566.232.875.23H8.56l-1.702 5.655c-.118.376-.089.78.08 1.138s.47.648.846.818c.251.118.527.18.808.182.267.002.53-.055.768-.168.238-.113.443-.278.6-.48l9.693-11.076a1.453 1.453 0 0 0 .172-1.631zM9.412 19.778l1.615-5.33c.044-.15.05-.308.018-.461s-.1-.297-.2-.421a1.064 1.064 0 0 0-.376-.296 1.13 1.13 0 0 0-.476-.11H6.654l7.884-8.967-1.605 5.33a.955.955 0 0 0 .173.882c.1.125.23.228.38.298.15.07.314.107.481.107h3.328z"></path>
            </svg>
            <p> Fast Track</p>
          </div>
          <Booking />
          <div className={styles.dropdowns}>
            <Dropdown title="What's included">
              <div className={styles.included__content}>
                <span>Included</span>
                <div>
                  <FaCheck size={20} color="#00806f" />
                  Fast-track entry
                </div>
                <div>
                  <FaCheck size={20} color="#00806f" />
                  Access to At the Top (floors 124 and 125)
                </div>
              </div>
            </Dropdown>
            <Dropdown title="Description">
              <p>
                Skip the line with fast-track tickets and take the high-speed
                double-decker elevator to Level 124. See Dubai from the
                observation deck. Use telescopes to spot the city’s landmarks.
              </p>
            </Dropdown>
            <Dropdown title="How to get there">
              <div className={styles.address}>
                <div className={styles.row}>
                  <div className={styles.column}>
                    <BsFillGeoAltFill size={24} />
                  </div>
                  <div className={styles.column}>
                    <span> Burj Khalifa</span>
                    <span>
                      <a href="https://www.google.com/maps/search/?api=1&query=Burj%20Khalifa%2C%201%20Sheikh%20Mohammed%20bin%20Rashid%20Blvd%20-%20Downtown%20Dubai%200%20Dubai">
                        {" "}
                        Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd -
                        Downtown Dubai, 0, Dubai
                      </a>{" "}
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
                      Registered address: James Wattstraat 77-P, 1097 DL,
                      Amsterdam, NL Reach out to the Tiqets Help Center, we act
                      as a contact on behalf of the activity supplier
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
        </section>
        <section className={styles.reviews}>
          <Reviews />
        </section>
      </div>
    </main>
  );
};

export default Main;
