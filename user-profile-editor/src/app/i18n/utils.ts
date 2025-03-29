import { Locale, locales, defaultLocale, Dictionary } from './config';
import enDictionary from './dictionaries/en';
import arDictionary from './dictionaries/ar';

export const dictionaryMap: Record<Locale, Dictionary> = {
  en: enDictionary,
  ar: arDictionary,
 
};

export function getDictionary(locale: Locale | undefined): Dictionary {
  if (!locale || !locales.includes(locale)) {
    return dictionaryMap[defaultLocale];
  }
  return dictionaryMap[locale];
}

export function getLocaleFromPathname(pathname: string): Locale {
  // Extract locale from path (e.g., /es/profile -> es)
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  
  // Check if the first segment is a valid locale
  if (localeFromPath && locales.includes(localeFromPath as Locale)) {
    return localeFromPath as Locale;
  }
  
  return defaultLocale;
}

export function createLocalizedUrl(pathname: string, locale: Locale): string {
  // Remove existing locale if present
  const pathWithoutLocale = pathname
    .split('/')
    .filter(segment => !locales.includes(segment as Locale))
    .join('/');
  
  // Add new locale
  return locale === defaultLocale
    ? pathWithoutLocale || '/'
    : `/${locale}${pathWithoutLocale || '/'}`;
}