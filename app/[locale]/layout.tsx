import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { locales } from '../../middleware';
import LocaleProvider from './LocaleProvider';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
    children: ReactNode;
    params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = await params;

    if (!locales.includes(locale as any)) {
        notFound();
    }

    let messages;
    try {
        messages = (await import(`../../messages/${locale}/common.json`)).default;
    } catch (error) {
        console.error("Locale file not found:", locale, error);
        notFound();
    }

    return (
        <LocaleProvider locale={locale} messages={messages}>
            <div className={inter.className}>
                {children}
            </div>
        </LocaleProvider>
    );
}