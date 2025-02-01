import React, { useState, DragEvent } from 'react';

export default function DragDropPage() {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        // Additional drop handling logic can be added here.
        console.log('Dropped files:', event.dataTransfer.files);
    };

    return (
        <div
            className={`min-h-screen flex justify-center items-center ${isDragOver ? 'bg-gray-200' : 'bg-white'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="p-8 border-2 border-dashed border-gray-400 rounded-lg w-1/2 text-center">
                <h1 className="text-2xl font-bold mb-4">Drag & Drop Area</h1>
                <p>Drag files here for future integration.</p>
            </div>
        </div>
    );
}