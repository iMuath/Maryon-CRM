import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-maryon-text-secondary">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={`w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
};