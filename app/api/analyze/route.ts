import { NextResponse } from "next/server";
import axios from "axios";
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  // Get the language from Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
  // Convert to ISO-639-1 format (e.g., en-US -> en)
  const language = acceptLanguage.split('-')[0];
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Verify file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory if it doesn't exist
    const tempPath = join(process.cwd(), 'temp');
    if (!existsSync(tempPath)) {
      await mkdir(tempPath, { recursive: true });
    }

    // Save file temporarily with timestamp to avoid conflicts
    const timestamp = Date.now();
    const filePath = join(tempPath, `${timestamp}-${file.name}`);
    await writeFile(filePath, buffer);

    // Convert image to base64
    const imageBase64 = buffer.toString('base64');

    // Verify Google API key exists
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Google API key missing");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    // Call Google Vision API
    const visionResponse = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
      {
        requests: [{
          image: { content: imageBase64 },
          features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "WEB_DETECTION", maxResults: 20 }
          ],
          imageContext: {
            languageHints: [language]
          }
        }]
      }
    );

    // Process results
    const labels = visionResponse.data.responses[0]?.labelAnnotations || [];
    const webEntities = visionResponse.data.responses[0]?.webDetection?.webEntities || [];
    
    // Filter for specific species only, excluding generic terms
    const insectLabels = [...labels, ...webEntities].filter((label: any) => {
      const description = label.description.toLowerCase();
      // Exclude generic terms
      if (description === 'insect' || description === 'bug' || description === 'pest') {
        return false;
      }
      // Include only if it's a specific species
      return (
        description.includes('beetle') ||
        description.includes('ant') ||
        description.includes('spider') ||
        description.includes('roach') ||
        description.includes('wasp') ||
        description.includes('bee') ||
        description.includes('moth') ||
        description.includes('fly') ||
        description.includes('cricket') ||
        description.includes('termite')||
        description.includes('tick')
      );
    });

    if (insectLabels.length === 0) {
      return NextResponse.json(
        { error: "No insect species detected in the image" },
        { status: 404 }
      );
    }

    // Sort by confidence and get the best match
    const bestMatch = insectLabels.sort((a: any, b: any) =>
      (b.score || b.confidence) - (a.score || a.confidence)
    )[0];

    // Ensure confidence is between 0 and 1
    const confidence = Math.min(Math.max(bestMatch.score || bestMatch.confidence || 0, 0), 1);

    // Clean up the temporary file
    try {
      await unlink(filePath);
    } catch (err) {
      console.error("Error cleaning up temporary file:", err);
    }

    return NextResponse.json({
      identifiedAs: bestMatch.description,
      confidence: confidence,
      redirectUrl: `${process.env.BUSINESS_URL || 'https://example.com'}/pest-control?species=${encodeURIComponent(bestMatch.description)}`,
      imageData: `data:${file.type};base64,${imageBase64}`
    });
    
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}