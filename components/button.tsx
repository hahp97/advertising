import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  outline?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  width?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  fullWidth = true,
  width,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      onClick={onClick}
      className={`
        bg-violet-500 
        hover:bg-violet-600 
        active:bg-violet-700 
        focus:outline-none 
        focus:ring 
        focus:ring-violet-300 
        rounded-lg 
        text-white 
        px-3 
        py-2 
        text-sm 
        font-semibold
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}  
      `}
    >
      <div className="px-3">{label}</div>
    </button>
  );
};

export default Button;
