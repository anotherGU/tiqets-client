import { useEffect, useState } from "react";
import styles from "./Main.module.css";
import { CiSearch } from "react-icons/ci";
import { TfiTicket } from "react-icons/tfi";
import EventsList from "../../components/EventsList/EventsList";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviews_count: number;
  category: string;
  image_urls: string[];
}


const Main = () => {
  const [events, setEvents] = useState<Event[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchEvents();
}, []);

const fetchEvents = async () => {
  try {
    const response = await fetch("/api/events");
    const data = await response.json();
    setEvents(data);
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.content}>
            <h1 className={styles.title}>
              Discover the world’s <br /> best experiences
            </h1>
            <div className={styles.inputWrapper}>
              <CiSearch className={styles.search__ico} />
              <input
                className={styles.search}
                type="text"
                placeholder="Search destinations & experiences"
              />
            </div>
            <div className={styles.end__row}>
              <TfiTicket color="white" />
              <p className={styles.end}>
                More than 50 million happy travelers booked with Tiqets
              </p>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="container">
          <div className={styles.info}>
            <div className={styles.info__block}>
              <div className={styles.info__ico}>
                <img src="/assets/main/info/refund.svg" alt="refund" />
              </div>
              <div className={styles.info__content}>
                <p className={styles.info__title}>Stay flexible</p>
                <p className={styles.info__subtitle}>
                  Flexible cancellation options on all venues
                </p>
              </div>
            </div>
            <div className={styles.info__block}>
              <div className={styles.info__ico}>
                <img src="/assets/main/info/trust.svg" alt="trust" />
              </div>
              <div className={styles.info__content}>
                <p className={styles.info__title}>Book with confidence</p>
                <p className={styles.info__subtitle}>
                  Easy booking and skip-the-line entry on your phone
                </p>
              </div>
            </div>
            <div className={styles.info__block}>
              <div className={styles.info__ico}>
                <img src="/assets/main/info/exhibition.svg" alt="exibit" />
              </div>
              <div className={styles.info__content}>
                <p className={styles.info__title}>Enjoy culture your way</p>
                <p className={styles.info__subtitle}>
                  The best experiences at museums and attractions worldwide
                </p>
              </div>
            </div>
          </div>
          <div className={styles.partners}>
            <h1 className={styles.partners__title}>
              We are a proud partner of the world’s most-loved venues
            </h1>
            <p className={styles.partners__description}>
              With more than 3,000 partners worldwide, Tiqets has a ticket for
              everyone. Not a fan of museums? We’ve got rollercoasters, too.
              Hate heights? Explore ancient ruins instead. With Tiqets, you
              choose your way to culture. Musée d'Orsay Louvre Museum Universal
              Orlando Resort
            </p>
            <div className={styles.partners__row}>
              <div className={styles.marquee}>
                <div className={styles.track}>
                  <img
                    src="/assets/main/partners/logo_casabatllo.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_heineken.avif" alt="" />
                  <img src="/assets/main/partners/logo_louvre.avif" alt="" />
                  <img src="/assets/main/partners/logo_met.avif" alt="" />
                  <img src="/assets/main/partners/logo_mo.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_nationaltrust.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_np360.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_royalpalaces.avif"
                    alt=""
                  />
                  <img
                    src="/assets/main/partners/logo_sealifesydney.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_vangogh.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_singapore-zoo.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_universal.avif" alt="" />

                  <img
                    src="/assets/main/partners/logo_casabatllo.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_heineken.avif" alt="" />
                  <img src="/assets/main/partners/logo_louvre.avif" alt="" />
                  <img src="/assets/main/partners/logo_met.avif" alt="" />
                  <img src="/assets/main/partners/logo_mo.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_nationaltrust.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_np360.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_royalpalaces.avif"
                    alt=""
                  />
                  <img
                    src="/assets/main/partners/logo_sealifesydney.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_vangogh.avif" alt="" />
                  <img
                    src="/assets/main/partners/logo_singapore-zoo.avif"
                    alt=""
                  />
                  <img src="/assets/main/partners/logo_universal.avif" alt="" />
                </div>
              </div>
            </div>
            <section className={styles.eventsSection}>
              <h2>Popular Experiences</h2>
              {loading ? (
                <div>Loading events...</div>
              ) : (
                <EventsList events={events} />
              )}
            </section>
          </div>
          <div className={styles.help__center}>
            <div className={styles.help__ico}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="192"
                height="192"
                viewBox="0 0 192 192"
                fill="none"
              >
                <path
                  d="M96 144C122.51 144 144 122.51 144 96C144 69.4903 122.51 48 96 48C69.4903 48 48 69.4903 48 96C48 122.51 69.4903 144 96 144Z"
                  fill="#B9E2E5"
                />
                <path
                  d="M108.31 64.291C108.31 64.291 120.685 71.5294 119.158 92.755C118.265 105.197 111.833 115.545 111.833 115.545C111.833 115.545 100.064 104.928 85.7501 105.763L90.7229 92.3038C90.7229 92.3038 111.142 87.091 112.083 74.1022L108.31 64.291Z"
                  fill="#AA7C57"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M97.6803 143.993L99.8237 112.886L107.196 112.137L121.673 112.08C125.292 112.06 128.355 114.729 128.844 118.32C129.251 121.319 129.664 126.187 129.999 130.713C121.569 138.766 110.209 143.78 97.6803 143.993Z"
                  fill="#388989"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M62.8487 129.883C71.5395 138.604 83.5634 144 96.8476 144C97.1255 144 97.4029 143.998 97.6797 143.993L99.8237 112.886L87.3821 114.153L68.9693 118.704C65.0045 119.683 63.2285 124.377 63.0845 126.393L62.8487 129.883Z"
                  fill="#5EC6CC"
                />
                <path
                  d="M99.4492 118.022L92.7868 124.8C92.7868 124.8 87.142 121.248 87.3916 114.144C87.3916 114.144 87.0172 110.169 96.2332 107.789L99.4492 118.022Z"
                  fill="#75CCCF"
                />
                <path
                  d="M99.4492 118.022L103.299 124.944C103.299 124.944 107.686 120.979 107.686 114.797C107.964 111.677 104.595 107.069 96.2332 107.789L99.4492 118.022Z"
                  fill="#5EC6CC"
                />
                <path
                  d="M91.0781 103.526L106.544 104.64L105.862 114.038C105.776 115.181 104.931 116.275 103.347 117.043C100.189 118.57 95.2925 118.224 92.4125 116.256C90.9725 115.277 90.3005 114.077 90.3965 112.925L91.0781 103.526Z"
                  fill="#CB8F7F"
                />
                <path
                  d="M98.4987 122.266C98.8731 122.083 99.1899 122.093 99.4107 122.246L99.9675 122.621C99.7467 122.467 99.4203 122.467 99.0555 122.64C98.3163 122.995 97.6827 123.946 97.6251 124.752C97.5963 125.155 97.7211 125.443 97.9419 125.597L97.3851 125.222C97.1643 125.069 97.0395 124.781 97.0683 124.378C97.1259 123.571 97.7691 122.63 98.4987 122.266Z"
                  fill="#EDE8CC"
                />
                <path
                  d="M99.0557 122.649C98.3165 123.005 97.6829 123.955 97.6253 124.761C97.5677 125.568 98.1245 125.942 98.8541 125.587C99.5933 125.232 100.227 124.281 100.284 123.475C100.342 122.659 99.7853 122.294 99.0557 122.649Z"
                  fill="#FED514"
                />
                <path
                  d="M98.4221 128.275C98.7965 128.093 99.1133 128.102 99.3341 128.256L99.8909 128.63C99.6701 128.477 99.3437 128.477 98.9789 128.65C98.2397 129.005 97.6061 129.955 97.5485 130.762C97.5197 131.165 97.6445 131.453 97.8653 131.606L97.3085 131.232C97.0877 131.078 96.9629 130.79 96.9917 130.387C97.0397 129.581 97.6829 128.63 98.4221 128.275Z"
                  fill="#EDE8CC"
                />
                <path
                  d="M98.9692 128.649C98.23 129.005 97.5964 129.955 97.5388 130.761C97.4812 131.568 98.038 131.942 98.7676 131.587C99.5068 131.232 100.14 130.281 100.198 129.475C100.256 128.659 99.7084 128.294 98.9692 128.649Z"
                  fill="#FED514"
                />
                <path
                  d="M98.3356 134.275C98.71 134.093 99.0268 134.102 99.2476 134.256L99.8044 134.63C99.5836 134.477 99.2572 134.477 98.8924 134.65C98.1532 135.005 97.5196 135.955 97.462 136.762C97.4332 137.165 97.558 137.453 97.7788 137.606L97.222 137.232C97.0012 137.078 96.8764 136.79 96.9052 136.387C96.9628 135.581 97.606 134.63 98.3356 134.275Z"
                  fill="#EDE8CC"
                />
                <path
                  d="M98.8925 134.659C98.1533 135.015 97.5197 135.965 97.4621 136.771C97.4045 137.578 97.9613 137.952 98.6909 137.597C99.4301 137.242 100.064 136.291 100.121 135.485C100.179 134.669 99.6317 134.295 98.8925 134.659Z"
                  fill="#FED514"
                />
                <path
                  d="M99.4493 118.023C99.4493 118.023 98.9693 115.383 100.889 115.2C100.889 115.2 105.478 114.461 106.025 111.859L106.697 113.933C106.697 113.933 105.699 118.195 99.4493 118.023Z"
                  fill="#5EC6CC"
                />
                <path
                  d="M99.4493 118.023L99.5357 116.832C99.6029 115.959 99.3917 115.383 98.5757 115.277C98.5757 115.277 92.4605 114.874 90.4925 111.687L88.9277 118.445L99.4493 118.023Z"
                  fill="#75CCCF"
                />
                <path
                  d="M111.545 77.1743C110.777 87.2159 90.9627 84.5951 90.2235 94.3007C89.4555 104.342 92.0187 109.411 100.534 110.064C109.049 110.717 114.32 97.6031 114.896 90.0767C115.625 80.4767 111.545 77.1743 111.545 77.1743Z"
                  fill="#F1AC99"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M103.128 109.831C110.113 108.002 114.381 96.8063 114.896 90.0769C115.043 88.1392 114.994 86.458 114.823 85.0088C113.459 85.0474 112.078 85.3241 110.5 86.0001C107 87.4998 106 89.9861 106.5 95.6897C106.685 97.8018 106.976 99.3632 107.196 100.33C107.334 100.938 106.933 101.567 106.316 101.655L104 101.986L103.128 109.831Z"
                  fill="#D99C8C"
                />
                <path
                  d="M114.627 83.021C111.891 85.1714 109.462 83.1554 107.244 82.0418C107.244 82.0418 111.056 80.1986 111.66 77.1554C111.651 77.1458 116.028 77.6834 114.627 83.021Z"
                  fill="#AA7C57"
                />
                <path
                  d="M74.4893 75.3695C79.9901 62.9567 93.0173 59.6639 103.491 62.1791C114.032 64.7039 112.073 74.1023 112.073 74.1023C111.67 72.9599 112.073 74.1023 112.073 74.1023C110.902 90.3647 90.9245 84.6431 90.2237 94.3583C89.8685 99.3311 93.3053 116.65 94.9469 119.222L73.8557 108.288C73.8557 108.288 68.1533 89.6831 74.4893 75.3695Z"
                  fill="#C38D63"
                />
              </svg>
            </div>
            <div className={styles.help__content}>
              <h1 className={styles.help__title}>Tiqets Help Center</h1>
              <p className={styles.help__description}>
                Our customer service team is available 24/7 via chat
              </p>
            </div>
          </div>
        </div>
        <div className={styles.download__wrapper}>
          <div className="container">
            <div className={styles.download}>
              <div className={styles.download__content}>
                <h1 className={styles.download__title}>
                  Download the Tiqets app for easy access to culture
                </h1>
                <p className={styles.download__description}>
                  Make your next experience one smooth ride with the Tiqets app.
                  Use it to discover your destination, plan on the go, store
                  your tickets offline and enjoy exclusive, app-user perks.
                </p>
                <div className={styles.download__buttons}>
                  <img
                    src="/assets/main/downloads/app-store-badge@2x.png"
                    alt=""
                  />
                  <img
                    src="/assets/main/downloads/google-play-badge-320.png"
                    alt=""
                  />
                </div>
                <p>Downloaded by over 5,000,000 travellers</p>
              </div>
              <div className={styles.download__img}>
                <div className={styles.phone__1}>
                  {" "}
                  <img
                    src="/assets/main/downloads/phone-1-desktop.avif"
                    alt=""
                  />
                </div>
                <div className={styles.phone__2}>
                  <img
                    src="/assets/main/downloads/phone-2-desktop.avif"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
