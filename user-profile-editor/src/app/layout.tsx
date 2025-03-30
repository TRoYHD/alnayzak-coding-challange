import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/global.css";
import { ToastProvider } from "./components/toast-provider";
import { defaultLocale } from "./i18n/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Profile Editor",
  description: "A Next.js form with SSR, Server Actions, and Zod validation",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: Promise<{
    locale?: string;
  }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  let locale = defaultLocale;
  
  if (params) {
    const resolvedParams = await params;
    locale = resolvedParams.locale || defaultLocale;
  }
  
  const isRTL = locale === 'ar';
  
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        {/* Add RTL-specific styles */}
        {isRTL && (
          <style type="text/css">{`
            body {
              text-align: right;
            }
            
            /* Fix layout for RTL */
            .space-x-4 > * + * {
              margin-left: 0;
              margin-right: 1rem;
            }
            
            /* Fix flex alignments for RTL */
            .justify-end {
              justify-content: flex-start;
            }
            
            /* Fix margins for RTL */
            .ml-3 {
              margin-left: 0;
              margin-right: 0.75rem;
            }
            
            /* Ensure text inputs and textareas are properly aligned */
            input, textarea {
              text-align: right; 
            }
          `}</style>
        )}
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}