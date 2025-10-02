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
import EventPage from "./pages/Event/EventPage.tsx";

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
      { path: "event", element: <EventPage /> },
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
