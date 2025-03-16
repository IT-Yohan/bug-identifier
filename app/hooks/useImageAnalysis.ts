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
export type AnalysisResponse = AnalysisResult | { errorMessage: string };

function isErrorResponse(response: AnalysisResponse): response is { errorMessage: string } {
  return (response as any).errorMessage !== undefined;
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
        throw new Error("errors.notImage");
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post<AnalysisResponse>("/api/analyze", formData, { validateStatus: () => true });

      if ('errorMessage' in response.data) {
        setError(response.data.errorMessage);
        console.error("API Error:", response.data.errorMessage);
      } else {
        setResult(response.data as AnalysisResult);
      }
    } catch (err) {
      let errorMessageKey = "errors.generic";
      if (err instanceof Error) {
        if (err.message === "errors.notImage") {
          errorMessageKey = "errors.notImage";
        } else if (axios.isAxiosError(err)) {
          console.error("Axios Error:", err);
          if (err.response?.data?.errorMessage) {
            errorMessageKey = err.response.data.errorMessage;
          }
        } else {
          console.error("Unexpected Error:", err);
        }
      } else {
        console.error("Unknown Error:", err);
      }
      setError(errorMessageKey);
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { result, loading, error, handleAnalysis };
}