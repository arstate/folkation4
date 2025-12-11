import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "font-mono font-bold border-2 border-black px-6 py-2 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  let colorStyle = "";
  
  switch(variant) {
    case 'primary':
      colorStyle = "bg-neo-cyan text-black shadow-hard hover:shadow-hard-hover hover:-translate-y-1 hover:-translate-x-1 hover:bg-cyan-300";
      break;
    case 'secondary':
      colorStyle = "bg-white text-black shadow-hard hover:shadow-hard-hover hover:-translate-y-1 hover:-translate-x-1";
      break;
    case 'accent':
      colorStyle = "bg-neo-pink text-white shadow-hard hover:shadow-hard-hover hover:-translate-y-1 hover:-translate-x-1";
      break;
    case 'danger':
      colorStyle = "bg-red-500 text-white shadow-hard hover:shadow-hard-hover hover:-translate-y-1 hover:-translate-x-1";
      break;
  }

  return (
    <button className={`${baseStyle} ${colorStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
