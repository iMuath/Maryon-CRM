import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-maryon-text-secondary">
        {label}
      </label>
      <input
        id={id}
        className={`w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
};