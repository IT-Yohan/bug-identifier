"use client";

import { useTranslations } from "next-intl";

// Define the type locally to avoid import issues
interface AnalysisResultType {
    identifiedAs: string;
    confidence: number;
    redirectUrl: string;
    imageData: string;
}

interface AnalysisResultProps {
    result: AnalysisResultType;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
    const t = useTranslations("common");

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("results.title")}</h2>
            <div className="mb-8">
                <div className="relative aspect-square w-full max-w-md mx-auto mb-8 rounded-lg overflow-hidden border border-gray-200">
                    <img
                        src={result.imageData}
                        alt={t("results.imageAlt", { species: result.identifiedAs })}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("results.species")}
                        </label>
                        <p className="text-lg font-medium text-gray-900">
                            {result.identifiedAs}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">
                            {t("results.confidence")}
                        </label>
                        <p className="text-lg font-medium text-gray-900">
                            {(result.confidence * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">
                    {t("results.serviceTitle")}
                </h3>
                <p className="text-gray-600 mb-6">{t("results.serviceDesc")}</p>
                <a
                    href={result.redirectUrl}
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t("results.serviceCTA")}
                </a>
            </div>
        </div>
    );
}