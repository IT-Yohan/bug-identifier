"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
    onAnalyze: (files: File[]) => void;
    loading: boolean;
    error: string | null;
}

export default function DropZone({ onAnalyze, loading, error }: DropZoneProps) {
    const t = useTranslations("common");

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onAnalyze(acceptedFiles);
            }
        },
        [onAnalyze]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png"] },
        maxSize: 4 * 1024 * 1024,
        maxFiles: 1,
    });

    return (
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
    );
}