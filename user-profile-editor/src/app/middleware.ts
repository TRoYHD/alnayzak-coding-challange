import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '../app/i18n/config';


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (!pathnameHasLocale) {
    // Determine the locale to use (from header or default)
    const locale = getLocaleFromHeader(request) || defaultLocale;
    
    // Add a locale-specific header that can be read from server components
    // This avoids the dynamic params issue
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);
    
    // Redirect to the same URL but with locale prefix
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    
    return NextResponse.redirect(newUrl);
  }
  
  // For paths that already have a locale, add the locale header
  const locale = pathname.split('/')[1];
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

function getLocaleFromHeader(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('Accept-Language');
  if (!acceptLanguage) return null;
  
  const acceptedLocales = acceptLanguage.split(',')
    .map(locale => locale.split(';')[0].trim().toLowerCase())
    .map(locale => locale.split('-')[0]);
  
  const matchedLocale = acceptedLocales.find(locale => 
    locales.includes(locale as any)
  );
  
  return matchedLocale || null;
}

export const config = {
  // Matcher ignoring api routes, static files, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};