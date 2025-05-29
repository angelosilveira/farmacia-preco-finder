import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface CurrencyInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove currency symbol, separators and any non-digits
    const numbers = inputValue.replace(/[^\d]/g, "");

    // Convert to number considering decimal places
    const numberValue = parseInt(numbers, 10) / 100;

    // Format the value
    const formatted = formatCurrency(numberValue);
    setDisplayValue(formatted);

    // Call onChange with the formatted value
    onChange(formatted);
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="R$ 0,00"
      {...props}
    />
  );
}
