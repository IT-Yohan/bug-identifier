// Simplify to a pure client component that doesn't need to await params
"use client";

import { Inter } from 'next/font/google';
import { ReactNode, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales } from '../../middleware';

const inter = Inter({ subsets: ['latin'] });

// Import messages statically to avoid async issues
const messages = {
    en: require('../../messages/en/common.json'),
    fr: require('../../messages/fr/common.json')
};

interface LocaleLayoutProps {
    children: ReactNode;
    params: { locale: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const router = useRouter();
    const locale = params.locale as string;

    // Validate locale on client side
    useEffect(() => {
        if (!locales.includes(locale as any)) {
            router.push('/en'); // Redirect to default locale
        }
    }, [locale, router]);

    // Use the messages for the current locale
    const localeMessages = messages[locale as keyof typeof messages] || messages.en;

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={{ common: localeMessages }}
            timeZone="Europe/Paris"
        >
            <div className={inter.className}>
                {children}
            </div>
        </NextIntlClientProvider>
    );
}