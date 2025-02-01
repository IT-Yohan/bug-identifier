"use client";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";

export interface AnalysisResult {
  identifiedAs: string;
  confidence: number;
  redirectUrl: string;
  imageData: string;
}

export function useImageAnalysis() {
  const t = useTranslations("common");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        throw new Error(t("errors.notImage"));
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<AnalysisResult>("/api/analyze", formData);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { result, loading, error, handleAnalysis };
}