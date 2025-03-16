"use client";

import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

// Import French messages directly
const messages = require('../../messages/fr/common.json');

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
    children: ReactNode;
}

export default function FrenchLayout({ children }: LayoutProps) {
    return (
        <NextIntlClientProvider
            locale="fr"
            messages={{ common: messages }}
            timeZone="Europe/Paris"
        >
            <div className={inter.className}>
                {children}
            </div>
        </NextIntlClientProvider>
    );
}