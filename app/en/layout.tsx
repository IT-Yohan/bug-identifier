"use client";

import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

// Import English messages directly
const messages = require('../../messages/en/common.json');

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
    children: ReactNode;
}

export default function EnglishLayout({ children }: LayoutProps) {
    return (
        <NextIntlClientProvider
            locale="en"
            messages={{ common: messages }}
            timeZone="Europe/Paris"
        >
            <div className={inter.className}>
                {children}
            </div>
        </NextIntlClientProvider>
    );
}