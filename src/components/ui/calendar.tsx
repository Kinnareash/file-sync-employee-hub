import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns"; // Added this import
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// components/ui/calendar.tsx
interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  mode?: 'day' | 'month'; // Add mode prop
}

const Calendar = ({
  selected,
  onSelect,
  className,
  placeholder = "Pick a date",
  disabled = false,
  mode = 'day', // Default to day picker
}: CalendarProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            <span>
              {mode === 'month' 
                ? format(selected, "MMMM yyyy") 
                : format(selected, "PPP")} // Formats differently based on mode
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DatePicker
          selected={selected}
          onChange={(date: Date | null) => onSelect(date || undefined)}
          inline
          showMonthYearPicker={mode === 'month'} // Only show month picker in month mode
          dateFormat={mode === 'month' ? "MMMM yyyy" : "P"}
          className="border-0"
        />
      </PopoverContent>
    </Popover>
  );
};

export { Calendar };