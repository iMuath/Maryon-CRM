import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-maryon-background';

  const variantClasses = {
    primary: 'bg-maryon-text-primary text-white hover:bg-gray-700 focus:ring-maryon-text-primary',
    secondary: 'bg-maryon-hover text-maryon-text-primary border border-maryon-border hover:bg-maryon-border focus:ring-maryon-border',
    ghost: 'bg-transparent text-maryon-text-secondary hover:bg-maryon-hover hover:text-maryon-text-primary',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};