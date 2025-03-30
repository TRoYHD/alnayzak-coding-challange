'use client';

import React, { useEffect, useState, ReactNode } from 'react';

interface RTLWrapperProps {
  locale: string;
  children: ReactNode;
}

export default function RTLWrapper({ locale, children }: RTLWrapperProps) {
  const isRTL = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return null or a simple loading state on server-side or before first render
  if (!mounted) {
    return <div>{children}</div>;
  }
  
  return (
    <div style={{ 
      direction: isRTL ? 'rtl' : 'ltr',
      textAlign: isRTL ? 'right' : 'left',
    }}>
      {children}
    </div>
  );
}