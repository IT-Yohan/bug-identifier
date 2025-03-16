"use client";

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

interface LocaleWrapperProps {
    children: ReactNode;
    locale: string;
    messages: any;
}

export default function LocaleWrapper({
    children,
    locale,
    messages
}: LocaleWrapperProps) {
    return (
        <NextIntlClientProvider
            locale={locale}
            messages={{ common: messages }}
            timeZone="Europe/Paris"
        >
            {children}
        </NextIntlClientProvider>
    );
}