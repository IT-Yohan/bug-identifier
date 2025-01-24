"use client";
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

export default function LocaleProvider({
    children,
    locale,
    messages
}: {
    children: ReactNode;
    locale: string;
    messages: any;
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={{ common: messages }} timeZone="Europe/Paris">
            {children}
        </NextIntlClientProvider>
    );
}
