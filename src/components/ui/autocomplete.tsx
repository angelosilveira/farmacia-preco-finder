import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  produto?: any;
}

interface AutocompleteProps {
  value: string;
  onInputChange: (value: string) => void;
  onSelect: (option: Option) => void;
  options: Option[];
  loading?: boolean;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function Autocomplete({
  value,
  onInputChange,
  onSelect,
  options,
  loading,
  placeholder,
  inputProps,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (open && options.length > 0 && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [open, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (option: Option) => {
    setInputValue(option.label);
    onSelect(option);
    setOpen(false);
  };

  console.log("Autocomplete options:", options);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        {...inputProps}
      />
      {open && (options.length > 0 || loading) && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full bg-white border rounded shadow max-h-56 overflow-auto mt-1"
        >
          {loading && (
            <li className="px-3 py-2 text-gray-500">Carregando...</li>
          )}
          {options.map((option) => (
            <li
              key={option.value}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
          {!loading && options.length === 0 && (
            <li className="px-3 py-2 text-gray-500">Nenhum resultado</li>
          )}
        </ul>
      )}
    </div>
  );
}
