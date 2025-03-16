"use client";

import { useTranslations } from "next-intl";

export default function Header() {
    const t = useTranslations("common");

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {t("header.title")}
                    </div>
                    <nav>
                        <a href="/privacy" className="text-gray-600 hover:text-gray-800">
                            {t("footer.privacy")}
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}