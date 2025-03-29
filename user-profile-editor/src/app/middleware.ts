import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '../app/i18n/config';

function getLocale(request: NextRequest) {
  // Get locale from pathname
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }

  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const acceptedLocales = acceptLanguage.split(',').map(locale => locale.split(';')[0].trim());
    const matchedLocale = acceptedLocales.find(locale => {
      const language = locale.split('-')[0];
      return locales.includes(language);
    });

    if (matchedLocale) {
      const language = matchedLocale.split('-')[0];
      if (locales.includes(language)) {
        return language;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }
  
  // Check if pathname already has a locale
  const segments = pathname.split('/').filter(Boolean);
  const hasLocale = segments.length > 0 && locales.includes(segments[0]);
  
  if (!hasLocale) {
    // Redirect to the same URL but with locale prefix
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }
}

export const config = {
  // Matcher ignoring api routes, static files, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};