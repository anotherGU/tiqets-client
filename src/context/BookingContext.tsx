import { createContext, useContext, useState } from "react";

interface TicketSelection {
  adult: number;
  child: number;
}

interface BookingData {
  sessionId?: string;
  bookingId?: string;
  date: string;
  time: {
    time: string;
    value: string;
    price: number;
  } | null;
  tickets: TicketSelection;
  totalPrice: number;
}

interface BookingContextType {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
};
