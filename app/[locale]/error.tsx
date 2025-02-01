'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const isNotFound = error.message.includes("404") || error.message.includes("Not Found");

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
            <h2 className="text-3xl font-bold text-red-600 mb-4">
                {isNotFound ? "Page Not Found" : "Something went wrong."}
            </h2>
            <p className="text-lg text-gray-800 mb-4">
                {isNotFound
                    ? "We could not find the page you are looking for. Please check the URL, or return to the homepage."
                    : "An unexpected error has occurred. Please try refreshing the page or contact support if the problem persists."}
            </p>
            <button onClick={() => reset()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Try again
            </button>
        </div>
    );
}