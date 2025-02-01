"use client";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { useImageAnalysis } from "./hooks/useImageAnalysis";

export default function Home() {
    const t = useTranslations("common");
    const { result, loading, error, handleAnalysis } = useImageAnalysis();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                handleAnalysis(acceptedFiles);
            }
        },
        [handleAnalysis]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png"] },
        maxSize: 4 * 1024 * 1024,
        maxFiles: 1,
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-6 sm:py-12">
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
                        {error}
                    </div>
                )}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transition-all hover:shadow-xl">
                    <div
                        {...getRootProps()}
                        className={[
                            "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                            loading
                                ? "border-blue-500 bg-blue-50"
                                : error
                                    ? "border-red-500 bg-red-50"
                                    : isDragActive
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-300 hover:border-gray-400",
                        ].join(" ")}
                        aria-label="File upload dropzone"
                    >
                        <input {...getInputProps()} />
                        <div className="space-y-4">
                            {loading ? (
                                <div
                                    className="flex flex-col items-center gap-2"
                                    aria-live="polite"
                                >
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-600">{t("analyzing")}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">
                                        {isDragActive ? t("drop") : t("upload")}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {t("header.supportedFormats")}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {result && (
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in mb-12">
                        <h2 className="text-2xl font-semibold mb-6">
                            {t("results.title")}
                        </h2>
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
                )}
                <footer className="mt-16 text-center text-sm text-gray-500">
                    <p>
                        {t("footer.service")} •{" "}
                        <a href="/privacy" className="hover:underline ml-1">
                            {t("footer.privacy")}
                        </a>
                    </p>
                </footer>
            </main>
        </div>
    );
}
