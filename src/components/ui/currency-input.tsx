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

    // Remove tudo que não é número
    const numbers = inputValue.replace(/\D/g, "");

    // Se vazio, retorna zero
    if (!numbers) {
      const formatted = formatCurrency(0);
      setDisplayValue(formatted);
      onChange(formatted);
      return;
    }

    try {
      // Converte para valor monetário (divide por 100 para considerar centavos)
      const numberValue = parseInt(numbers, 10) / 100;
      const formatted = formatCurrency(numberValue);
      setDisplayValue(formatted);
      onChange(formatted);
    } catch (error) {
      console.error("Error formatting currency:", error);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
