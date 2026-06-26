import React, { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">{icon}</div>}
        <input
          className={`
            w-full px-4 py-2.5 rounded-2xl
            bg-card/40 border border-white/10
            text-white placeholder-white/40
            focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-white/60 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2.5 rounded-2xl
          bg-card/40 border border-white/10
          text-white placeholder-white/40
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-danger/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-white/60 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
