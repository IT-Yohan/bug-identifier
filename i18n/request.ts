import {NextRequest} from 'next/server';

export const locales = ['en', 'fr'];
export const defaultLocale = 'en';

export function getRequestConfig(_request: NextRequest) {
  return {locale: defaultLocale};
}
