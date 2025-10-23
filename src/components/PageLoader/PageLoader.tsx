import React from "react";
import styles from "./PageLoader.module.css";

const PageLoader: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default PageLoader;
