import createMiddleware from 'next-intl/middleware';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always'
});

// Use the new route segment config format
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
} satisfies { matcher: string[] };