import { createContext, useContext, useState, useEffect } from "react";

interface TicketSelection {
  adult: number;
  child: number;
}

interface TicketPrices {
  adult: number;
  child: number;
}

interface BookingData {
  date: string;
  tickets: {
    adult: number;
    child: number;
  };
  ticketPrices: {
    adult: number;
    child: number;
  };
  totalPrice: number;
  originalPrice?: number;
  // 👇 добавь сюда
  event?: {
    id: string;
    title: string;
    location: string;
    image_urls: string[];
  };
}

interface BookingContextType {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData | null) => void;
  clearBookingData: () => void;
  calculateTotalPrice: (
    tickets: TicketSelection,
    prices: TicketPrices
  ) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Ключ для localStorage
const BOOKING_DATA_KEY = "bookingData";

export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);

useEffect(() => {
  const handleStorageChange = () => {
    const savedBookingData = localStorage.getItem(BOOKING_DATA_KEY);
    if (savedBookingData) {
      try {
        const parsedData = JSON.parse(savedBookingData);
        // Проверяем, что данные действительно изменились
        if (JSON.stringify(bookingData) !== JSON.stringify(parsedData)) {
          setBookingDataState(parsedData);
        }
      } catch (error) {
        console.error("Error parsing booking data from localStorage:", error);
      }
    }
  };

  // Слушаем изменения в localStorage
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, [bookingData]);

  // Функция для расчета общей стоимости
  const calculateTotalPrice = (
    tickets: TicketSelection,
    prices: TicketPrices
  ): number => {
    return tickets.adult * prices.adult + tickets.child * prices.child;
  };

  // Функция для установки данных с сохранением в localStorage
  const setBookingData = (data: BookingData | null) => {
    setBookingDataState(data);
    if (data) {
      localStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(BOOKING_DATA_KEY);
    }
  };

  // Функция для очистки данных бронирования
  const clearBookingData = () => {
    setBookingDataState(null);
    localStorage.removeItem(BOOKING_DATA_KEY);
    localStorage.removeItem("currentSessionId");
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        clearBookingData,
        calculateTotalPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");

  return ctx;
};
