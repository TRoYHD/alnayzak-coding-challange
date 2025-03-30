import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string[];
  description?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    className, 
    label, 
    error, 
    description, 
    id, 
    maxLength, 
    showCharCount = false,
    onChange,
    value,
    defaultValue,
    ...props 
  }, ref) => {
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = error && error.length > 0;
    
    const [charCount, setCharCount] = useState(() => {
      if (typeof value === 'string') {
        return value.length;
      }
      if (typeof defaultValue === 'string') {
        return defaultValue.length;
      }
      return 0;
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange && onChange(e);
    };
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          {label && (
            <label 
              htmlFor={inputId} 
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className="text-xs text-gray-500">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          className={twMerge(
            "flex min-h-24 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError 
              ? "border-red-500 focus-visible:ring-red-500" 
              : "border-gray-300",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
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

TextArea.displayName = "TextArea";