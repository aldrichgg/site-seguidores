import React, { useState } from "react";
import { Button } from "./button";
import { Calendar } from "lucide-react";
import { Input } from "./input";

export const DatePickerWithRange = ({ date, onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    onDateChange?.({ start, end });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-full">
        <Input
          placeholder="Selecione o período"
          value={
            startDate && endDate
              ? `${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`
              : ""
          }
          readOnly
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}; 