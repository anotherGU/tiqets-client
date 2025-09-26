import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.smartsupp) {
        window.smartsupp("widget:hide"); // скрыть кнопку
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
