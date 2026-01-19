import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react'; // Icon for loading

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ 
  children, 
  isLoading, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = "w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-4";
  
  const variants = {
    primary: "text-white bg-violet-600 hover:bg-violet-700 focus:ring-violet-800",
    secondary: "text-slate-300 bg-slate-800 hover:bg-slate-700 focus:ring-slate-700 border border-slate-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};