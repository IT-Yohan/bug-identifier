import { NextResponse } from "next/server";
import { analyzeImage, filterInsectLabels } from "../../services/vision/visionService";
import { translateText } from "../../services/translation/translationService";

export async function POST(request: Request) {
  const acceptLanguage = request.headers.get('Accept-Language')?.split(',')[0] || 'en';
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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageBase64 = buffer.toString('base64');

    if (!process.env.GOOGLE_API_KEY) {
      console.error("Google API key missing");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    // Analyze the image using vision service
    const { labels, webEntities } = await analyzeImage(imageBase64, language);
    
    // Filter for insect labels using the service function
    const insectLabels = filterInsectLabels(labels, webEntities);

    if (insectLabels.length === 0) {
      return NextResponse.json({
        identifiedAs: null,
        errorMessage: "No insect species detected in the image. Please upload a clear image of an insect."
      });
    }

    // Sort by confidence and get best match
    const bestMatch = insectLabels.sort(
      (a: any, b: any) => (b.score || b.confidence) - (a.score || a.confidence)
    )[0];

    const confidence = Math.min(Math.max(bestMatch.score || bestMatch.confidence || 0, 0), 1);
    const originalDescription = bestMatch.description;
    
    // Translate if needed using translation service
    let localizedDescription = originalDescription;
    if (language !== "en") {
      try {
        localizedDescription = await translateText(originalDescription, language);
      } catch (err) {
        console.error("Translation error:", err);
        // Fallback to originalDescription if translation fails
      }
    }

    return NextResponse.json({
      identifiedAs: localizedDescription,
      confidence: confidence,
      redirectUrl: `${
        process.env.BUSINESS_URL || "https://example.com"
      }/devis-et-prix?species=${encodeURIComponent(originalDescription)}`,
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
