import { NextRequest, NextResponse } from 'next/server';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en';

// Simplified middleware that simply handles locale detection
export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Skip API routes and static files
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Redirect from / to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Check if the path already includes a valid locale
  const isValidLocalePath = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // If it's a valid locale path, continue
  if (isValidLocalePath) {
    return NextResponse.next();
  }
  
  // Get user's preferred locale from Accept-Language header or use default
  const acceptLanguage = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0];
  const preferredLocale = locales.includes(acceptLanguage as any) ? acceptLanguage : defaultLocale;
  
  // Redirect to the path with the user's preferred locale
  return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
}

export const config = {
  // Skip paths that shouldn't be processed by the middleware
  matcher: ['/((?!api|_next|.*\\..*).*)']
};