import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string[];
  description?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, description, id, onBlur, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = error && error.length > 0;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError 
              ? "border-red-500 focus-visible:ring-red-500" 
              : "border-gray-300",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
          onBlur={onBlur}
          {...props}
        />
        {description && !hasError && (
          <p id={`${inputId}-description`} className="text-sm text-gray-500">
            {description}
          </p>
        )}
        {hasError && (
          <div id={`${inputId}-error`} className="text-sm text-red-500">
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";