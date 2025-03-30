// app/layout.tsx
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
  // Default to English if locale is not provided
  let locale = defaultLocale;
  
  // Safely await params if it exists
  if (params) {
    const resolvedParams = await params;
    locale = resolvedParams.locale || defaultLocale;
  }
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}