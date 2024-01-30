'use client';

import { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Input = ({ id, label, type = 'text', value, placeholder, onChange, onBlur }: InputProps) => {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="
          text-gray-500
          transition-all
          transform
          origin-left
          pointer-events-none
        "
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder ? placeholder : ''}
        type={type}
        className="
         mt-1
          w-full
          p-2
          border
          rounded
          focus:outline-none
          focus:border-blue-500
        "
      />
    </div>
  );
};

export default Input;
