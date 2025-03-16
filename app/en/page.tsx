"use client";
import { useTranslations } from "next-intl";
import { useImageAnalysis } from "../hooks/useImageAnalysis";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DropZone from "../components/ui/DropZone";
import AnalysisResult from "../components/ui/AnalysisResult";

export default function EnglishHome() {
    const t = useTranslations("common");
    const { result, loading, error, handleAnalysis } = useImageAnalysis();

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-6 sm:py-12">
            <Header />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {t("header.title")}
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        {t("header.description")}
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                        <span>{t("header.secure")}</span>
                        <span>{t("header.fileSize")}</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {t(error)}
                    </div>
                )}

                <DropZone
                    onAnalyze={handleAnalysis}
                    loading={loading}
                    error={error}
                />

                {result && <AnalysisResult result={result} />}

                <Footer />
            </main>
        </div>
    );
}