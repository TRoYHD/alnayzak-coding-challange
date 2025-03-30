'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Locale } from '../i18n/config';

interface RTLContextType {
  isRTL: boolean;
  locale: Locale;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

interface RTLProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function RTLProvider({ locale, children }: RTLProviderProps) {
  const isRTL = locale === 'ar';
  
  return (
    <RTLContext.Provider value={{ isRTL, locale }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </RTLContext.Provider>
  );
}

export function useRTL() {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
}