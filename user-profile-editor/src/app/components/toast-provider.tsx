"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "./ui/toast";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    id: number;
    duration?: number;
  } | null>(null);

  // Use useCallback to ensure the function reference remains stable
  const showToast = useCallback((message: string, type: ToastType = "info", duration?: number) => {
    setToast({
      message,
      type,
      id: Date.now(), 
      duration,
    });
  }, []);

  // Close toast handler - also use useCallback
  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}