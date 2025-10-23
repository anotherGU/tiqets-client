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
  sessionId?: string;
  bookingId?: string;
  date: string;
  tickets: TicketSelection;
  ticketPrices: TicketPrices; // Добавлено это поле
  totalPrice: number;
  originalPrice?: number; // Добавляем цену без скидки
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

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const savedBookingData = localStorage.getItem(BOOKING_DATA_KEY);
    if (savedBookingData) {
      try {
        setBookingDataState(JSON.parse(savedBookingData));
      } catch (error) {
        console.error("Error parsing booking data from localStorage:", error);
        localStorage.removeItem(BOOKING_DATA_KEY);
      }
    }
  }, []);

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
