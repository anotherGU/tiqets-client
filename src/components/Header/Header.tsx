import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import img from "/assets/header/204170-tiqets-logotype-color-320-426944-medium-1460638766.png";
import { IoMdHelpCircleOutline } from "react-icons/io";

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <Link to={"/"}>
              <img className={styles.logo} src={img} alt="" />
            </Link>
          </div>
          <div className={styles.toolbar}>
            <a href="https://support.tiqets.com/">
              <div className={styles.help}>
                <IoMdHelpCircleOutline size={20} />
                <p>Help</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
