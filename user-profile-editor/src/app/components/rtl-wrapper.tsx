'use client';

import React, { ReactNode } from 'react';

interface RTLWrapperProps {
  locale: string;
  children: ReactNode;
}

export default function RTLWrapper({ locale, children }: RTLWrapperProps) {
  const isRTL = locale === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}