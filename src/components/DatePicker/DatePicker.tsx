import React, { useState } from "react";
import styles from "./DatePicker.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

interface DayInfo {
  date: number;
  price: number;
  isCurrentMonth: boolean;
  fullDate: Date;
  isPast: boolean;
}

const DatePicker: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(
    selectedDate || null
  );

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Функция для проверки, является ли дата прошедшей (без учета времени)
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return; // Не выбираем прошедшие даты

    setSelectedDay(date);
    onDateSelect?.(date);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const generateCalendarDays = (): DayInfo[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Adjust for Monday as first day (0 = Sunday, 1 = Monday, etc.)
    // Для понедельника как первого дня: 0=Воскресенье, 1=Понедельник и т.д.
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days: DayInfo[] = [];

    // Add days from previous month
    // Добавляем дни из предыдущего месяца
    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      0
    ).getDate();

    // Начинаем с последних дней предыдущего месяца
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const date = daysInPrevMonth - i;
      const fullDate = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        date
      );
      days.push({
        date,
        price: 79,
        isCurrentMonth: false,
        fullDate,
        isPast: isPastDate(fullDate),
      });
    }

    // Add days of current month
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        price: 79,
        isCurrentMonth: true,
        fullDate,
        isPast: isPastDate(fullDate),
      });
    }

    // Add days from next month to complete the grid (42 cells total for 6 rows)
    // Добавляем дни из следующего месяца для завершения сетки (всего 42 ячейки для 6 строк)
    const totalCells = 42;
    const nextMonth = new Date(year, month + 1, 1);
    let nextMonthDay = 1;

    while (days.length < totalCells) {
      const fullDate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        nextMonthDay
      );
      days.push({
        date: nextMonthDay,
        price: 79,
        isCurrentMonth: false,
        fullDate,
        isPast: isPastDate(fullDate),
      });
      nextMonthDay++;
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getMonthName = (date: Date): string => {
    return months[date.getMonth()];
  };

  const getYear = (date: Date): number => {
    return date.getFullYear();
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => navigateMonth("prev")}
          aria-label="Previous month"
        >
          <IoIosArrowBack size={24} />
        </button>
        <h3 className={styles.monthTitle}>
          {getMonthName(currentDate)} {getYear(currentDate)}
        </h3>
        <button
          className={styles.navButton}
          onClick={() => navigateMonth("next")}
          aria-label="Next month"
        >
          <IoIosArrowForward size={24} />
        </button>
      </div>

      <div className={styles.daysHeader}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={`${styles.dayCell} ${
              !dayInfo.isCurrentMonth ? styles.otherMonthDay : ""
            } ${dayInfo.isPast ? styles.pastDay : ""} ${
              selectedDay &&
              dayInfo.fullDate.getDate() === selectedDay.getDate() &&
              dayInfo.fullDate.getMonth() === selectedDay.getMonth() &&
              dayInfo.fullDate.getFullYear() === selectedDay.getFullYear()
                ? styles.selectedDay
                : ""
            }`}
            onClick={() =>
              !dayInfo.isPast && handleDateSelect(dayInfo.fullDate)
            }
          >
            <div className={styles.dateNumber}>{dayInfo.date}</div>
          </div>
        ))}
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};

export default DatePicker;