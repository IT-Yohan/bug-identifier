"use client";
'use client';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const t = useTranslations('common');
  const [result, setResult] = useState<{
    identifiedAs: string;
    confidence: number;
    redirectUrl: string;
    imageData: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      const analysis = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!analysis.data?.identifiedAs) {
        throw new Error('Could not identify insect species');
      }

      setResult(analysis.data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      handleAnalysis(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 4 * 1024 * 1024, // 4MB
    maxFiles: 1
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('header.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('header.description')}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {t('header.secure')}
            </div>
            <div className="flex items-center gap-1">
              {t('header.fileSize')}
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 transition-all hover:shadow-xl">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${loading ? 'border-blue-500 bg-blue-50' :
                error ? 'border-red-500 bg-red-50' :
                  isDragActive ? 'border-green-500 bg-green-50' :
                    'border-gray-300 hover:border-gray-400'}`}
          >
            <input {...getInputProps()} />

            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">Analyzing your image...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    {error || (isDragActive ? 'Drop your image here' : 'Drag & drop or click to upload')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: JPEG, PNG (max 4MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">
              Analysis Results
            </h2>

            <div className="mb-8">
              <div className="relative aspect-square w-full max-w-md mx-auto mb-8 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={result.imageData}
                  alt="Uploaded pest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Identified Species</label>
                  <p className="text-lg font-medium text-gray-900">
                    {result.identifiedAs}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Confidence Level</label>
                  <p className="text-lg font-medium text-gray-900">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Professional Extermination Service</h3>
              <p className="text-gray-600 mb-6">
                Get expert pest control solutions tailored to your specific needs
              </p>
              <a
                href={result.redirectUrl}
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule Free Consultation →
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Secure service powered by Google Vision AI •
            <a href="/privacy" className="hover:underline ml-1">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
