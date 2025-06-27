import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CustomCalendar: React.FC<Props> = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const generateCalendar = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const endDate = endOfMonth(currentMonth);
    const days: JSX.Element[] = [];

    let day = startDate;
    while (day <= endDate || days.length % 7 !== 0) {
      const thisDay = day;
      const isCurrentMonth = isSameMonth(thisDay, currentMonth);
      const isSelected = isSameDay(thisDay, selectedDate);

      days.push(
        <div
          key={thisDay.toISOString()}
          onClick={() => onChange(thisDay)}
          className={`w-10 h-10 flex items-center justify-center text-sm cursor-pointer rounded
            ${!isCurrentMonth ? "text-gray-400" : ""}
            ${isSelected ? "bg-blue-600 text-white" : "hover:bg-blue-100"}
          `}
        >
          {format(thisDay, "d")}
        </div>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-lg px-2">&lt;</button>
        <div className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</div>
        <button onClick={nextMonth} className="text-lg px-2">&gt;</button>
      </div>
      <div className="grid grid-cols-7 mb-2 font-semibold text-center text-gray-700">
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {generateCalendar()}
      </div>
    </div>
  );
};

export default CustomCalendar;
