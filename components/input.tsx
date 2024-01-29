'use client';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  pattern?: string;
  rules?: Partial<Record<string, any>>;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ id, label, type = 'text', disabled, placeholder, onChange }) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder ? placeholder : ' '}
        type={type}
        className={`
          peer
          w-full
          h-auto
          p-4
          pt-6
          input
          disabled:opacity-70
          disabled:cursor-not-allowed
         
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute
          text-md
          duration-100
          transform
          -translate-y-3
          top-5
          z-100
          origin-[0]
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
