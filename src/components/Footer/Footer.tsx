import Dropdown from "../UI/Dropdown/Dropdown";
import styles from "./Footer.module.css";
// import {
//   FaInstagram,
//   FaTiktok,
//   FaFacebookF,
//   FaXTwitter,
//   FaLinkedinIn,
// } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__top}>
          <div className={styles.row}>
            <div className={styles.column}>
              <ul>
                <a href="https://www.tiqets.com/en/barcelona-attractions-c66342/">
                  <li>Barcelona</li>
                </a>
                <a href="https://www.tiqets.com/en/london-attractions-c67458/">
                  <li>London</li>
                </a>
                <a href="https://www.tiqets.com/en/new-york-attractions-c260932/">
                  <li>New York</li>
                </a>

                <a href="https://www.tiqets.com/en/things-to-do-in-paris-c66746/">
                  <li>Paris</li>
                </a>

                <a href="https://www.tiqets.com/en/rome-attractions-c71631/">
                  <li>Rome</li>
                </a>

                <a href="https://www.tiqets.com/en/all-destinations/">
                  <li>All Destinations</li>
                </a>
              </ul>
            </div>
            <div className={styles.column}>
              <ul>
                <a href="https://www.tiqets.com/blog/">
                  <li>Tiqets Blog</li>
                </a>
                <a href="https://www.tiqets.com/en/about-tiqets/">
                  <li>About us</li>
                </a>

                <a href="https://tiqets.homerun.co/">
                  <li>Jobs</li>
                </a>

                <a href="https://www.tiqets.com/en/responsible-disclosure/">
                  <li>Responsible Disclosure</li>
                </a>

                <a href="https://www.tiqetsnews.com/en/">
                  <li>Newsroom</li>
                </a>
              </ul>
            </div>
            <div className={styles.column}>
              <ul>
                <a href="https://support.tiqets.com/">
                  <li>Help Center</li>
                </a>

                <a href="https://suppliers.tiqets.com/">
                  <li>Help Center for Suppliers</li>
                </a>

                <a href="https://www.tiqets.com/en/terms-and-conditions/">
                  <li>Terms & Conditions</li>
                </a>

                <a href="https://www.tiqets.com/en/privacy-policy/">
                  <li>Privacy Policy</li>
                </a>

                <a href="https://www.tiqets.com/en/tiqets-app-download/">
                  <li>Tiqets App</li>
                </a>
              </ul>
            </div>
            <div className={styles.column}>
              <ul>
                <a href="https://tiqets.com/venues/">
                  <li>Become a Supplier</li>
                </a>

                <a href="https://www.tiqets.com/partner-program/">
                  <li>Become a Distributor</li>
                </a>
              </ul>
            </div>
            <div className={styles.dropdowns}>
              <Dropdown color="white" title="Explore">
                <ul>
                  <a href="https://www.tiqets.com/en/barcelona-attractions-c66342/">
                    <li>Barcelona</li>
                  </a>
                  <a href="https://www.tiqets.com/en/london-attractions-c67458/">
                    <li>London</li>
                  </a>
                  <a href="https://www.tiqets.com/en/new-york-attractions-c260932/">
                    <li>New York</li>
                  </a>

                  <a href="https://www.tiqets.com/en/things-to-do-in-paris-c66746/">
                    <li>Paris</li>
                  </a>

                  <a href="https://www.tiqets.com/en/rome-attractions-c71631/">
                    <li>Rome</li>
                  </a>

                  <a href="https://www.tiqets.com/en/all-destinations/">
                    <li>All Destinations</li>
                  </a>
                </ul>
              </Dropdown>
              <Dropdown color="white" title="Company">
                <ul>
                  <a href="https://www.tiqets.com/blog/">
                    <li>Tiqets Blog</li>
                  </a>
                  <a href="https://www.tiqets.com/en/about-tiqets/">
                    <li>About us</li>
                  </a>

                  <a href="https://tiqets.homerun.co/">
                    <li>Jobs</li>
                  </a>

                  <a href="https://www.tiqets.com/en/responsible-disclosure/">
                    <li>Responsible Disclosure</li>
                  </a>

                  <a href="https://www.tiqetsnews.com/en/">
                    <li>Newsroom</li>
                  </a>
                </ul>
              </Dropdown>
              <Dropdown color="white" title="Support">
                <ul>
                  <a href="https://support.tiqets.com/">
                    <li>Help Center</li>
                  </a>

                  <a href="https://suppliers.tiqets.com/">
                    <li>Help Center for Suppliers</li>
                  </a>

                  <a href="https://www.tiqets.com/en/terms-and-conditions/">
                    <li>Terms & Conditions</li>
                  </a>

                  <a href="https://www.tiqets.com/en/privacy-policy/">
                    <li>Privacy Policy</li>
                  </a>

                  <a href="https://www.tiqets.com/en/tiqets-app-download/">
                    <li>Tiqets App</li>
                  </a>
                </ul>
              </Dropdown>
              <Dropdown color="white" title="Partnerships">
                <ul>
                  <a href="https://tiqets.com/venues/">
                    <li>Become a Supplier</li>
                  </a>

                  <a href="https://www.tiqets.com/partner-program/">
                    <li>Become a Distributor</li>
                  </a>
                </ul>
              </Dropdown>
            </div>

          </div>
        </div>
      </div>
      <div className={styles.footer__bottom}>
        <div className="container">
          <div className={styles.row}>
            <div className={styles.column}>
              <img
                width={108}
                height={42}
                src="/assets/footer/345129-WhiteLogo-49dfde-medium-1581502043.png"
                alt=""
              />
            </div>
            <div className={styles.column}>
              <div className={styles.privacy}>
                {" "}
                © 2014-2025 Tiqets{" "}
                <img
                  width={15}
                  height={22}
                  src="/assets/footer/tulip.svg"
                  alt=""
                />{" "}
                Amsterdam
              </div>
            </div>
            {/* <div className={styles.column}>
              <div className={styles.media}>
                <span className={styles.media__item}>
                  <a href="https://www.instagram.com/tiqets/">
                    <FaInstagram size={20} />
                  </a>
                </span>
                <span className={styles.media__item}>
                  <a href="https://www.tiktok.com/@tiqets">
                    <FaTiktok size={20} />
                  </a>
                </span>
                <span className={styles.media__item}>
                  <a href="https://www.facebook.com/Tiqets/">
                    <FaFacebookF size={20} />
                  </a>
                </span>
                <span className={styles.media__item}>
                  <a href="https://twitter.com/tiqets">
                    <FaXTwitter size={20} />
                  </a>
                </span>
                <span className={styles.media__item}>
                  <a href="https://nl.linkedin.com/company/tiqets">
                    <FaLinkedinIn size={20} />
                  </a>
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
