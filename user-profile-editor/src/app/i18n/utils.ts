import { Locale, Dictionary, defaultLocale, locales } from './config';
import enDictionary from './dictionaries/en';
import arDictionary from './dictionaries/ar';

// Dictionary mapping
const dictionaries = {
  en: enDictionary,
  ar: arDictionary,
};

export function getDictionary(locale: Locale | undefined): Dictionary {
  // If locale is undefined or not supported, use default locale
  if (!locale || !dictionaries[locale]) {
    return dictionaries[defaultLocale];
  }
  
  // Return the dictionary for the requested locale
  return dictionaries[locale];
}

export function getLocaleFromPathname(pathname: string): Locale {
  const pathnameSegments = pathname.split('/').filter(segment => segment);
  const firstSegment = pathnameSegments[0];
  
  if (locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

export function createLocalizedUrl(pathname: string, locale: Locale): string {
  // Extract the current locale from the path
  const pathnameSegments = pathname.split('/').filter(segment => segment);
  const currentLocale = pathnameSegments[0];
  
  // Check if the current path starts with a valid locale
  const hasLocalePrefix = locales.includes(currentLocale as Locale);
  
  if (hasLocalePrefix) {
    // Remove the current locale from the path
    const pathWithoutLocale = '/' + pathnameSegments.slice(1).join('/');
    return `/${locale}${pathWithoutLocale}`;
  } else {
    // If the path doesn't start with a locale, just add the new locale
    return `/${locale}${pathname}`;
  }
}