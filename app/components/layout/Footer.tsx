"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("common");

    return (
        <footer className="mt-16 text-center text-sm text-gray-500">
            <p>
                {t("footer.service")} •{" "}
                <a href="/privacy" className="hover:underline ml-1">
                    {t("footer.privacy")}
                </a>
            </p>
        </footer>
    );
}