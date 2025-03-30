"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, locales } from "../i18n/config";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLocale = locales.find(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  ) || "en";
  
  const languageNames: Record<Locale, string> = {
    en: "English",
    ar: "العربية",
  };
  
  const handleLocaleChange = (locale: Locale) => {
    // Extract the path after the current locale
    let pathAfterLocale = pathname.replace(new RegExp(`^/${currentLocale}`), '');
    
    // If there's no path after locale or it's just '/', use empty string
    if (pathAfterLocale === '' || pathAfterLocale === '/') {
      pathAfterLocale = '';
    }
    
    // Create the new localized URL
    const newPath = `/${locale}${pathAfterLocale}`;
    
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{languageNames[currentLocale as Locale]}</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            {locales.map((locale) => (
              <button
                key={locale}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  locale === currentLocale
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
                onClick={() => handleLocaleChange(locale)}
              >
                {languageNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}