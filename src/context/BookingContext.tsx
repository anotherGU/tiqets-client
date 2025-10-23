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
  booking_id?: string; // сохранено для совместимости
  bookingId?: string; // 👈 добавлено обратно для совместимости с Success.tsx
  sessionId?: string; // 👈 вернули поле, используется на Success.tsx
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
  event: {
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

const BOOKING_DATA_KEY = "bookingData";

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);


  useEffect(() => {
  const savedBookingData = localStorage.getItem(BOOKING_DATA_KEY);
  if (savedBookingData) {
    try {
      const parsedData = JSON.parse(savedBookingData);
      setBookingDataState(parsedData);
    } catch (error) {
      console.error("Error parsing booking data from localStorage:", error);
    }
  }
}, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedBookingData = localStorage.getItem(BOOKING_DATA_KEY);
      if (savedBookingData) {
        try {
          const parsedData = JSON.parse(savedBookingData);
          if (JSON.stringify(bookingData) !== JSON.stringify(parsedData)) {
            setBookingDataState(parsedData);
          }
        } catch (error) {
          console.error("Error parsing booking data from localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [bookingData]);

  const calculateTotalPrice = (
    tickets: TicketSelection,
    prices: TicketPrices
  ): number => {
    return tickets.adult * prices.adult + tickets.child * prices.child;
  };

  const setBookingData = (data: BookingData | null) => {
    setBookingDataState(data);
    if (data) {
      localStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(BOOKING_DATA_KEY);
    }
  };

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
