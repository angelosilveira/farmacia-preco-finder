import { Input, InputProps } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

interface CurrencyInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  // Mantém o valor formatado internamente
  const [displayValue, setDisplayValue] = useState(value);

  // Atualiza o display value quando o value prop muda
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

    // Remove tudo que não é número ou ponto
    const numbers = inputValue.replace(/[^\d.]/g, "");

    // Se vazio, retorna zero
    if (!numbers) {
      const formatted = formatCurrency(0);
      setDisplayValue(formatted);
      onChange(formatted);
      return;
    }

    try {
      // Converte para número
      let numberValue = parseFloat(numbers);

      // Se o input não tem ponto decimal, assume que é um valor inteiro
      if (!inputValue.includes(".")) {
        numberValue = numberValue / 100;
      }

      const formatted = formatCurrency(numberValue);
      setDisplayValue(formatted);
      onChange(formatted);
    } catch (error) {
      console.error("Error formatting currency:", error);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Garante que o valor está sempre formatado no blur
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
