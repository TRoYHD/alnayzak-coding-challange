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
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}