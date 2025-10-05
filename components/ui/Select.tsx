import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-maryon-text-secondary">
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};