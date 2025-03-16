import axios from "axios";

export interface VisionAnalysisResult {
  labels: any[];
  webEntities: any[];
}

/**
 * Analyzes an image using Google Vision API
 * @param imageBase64 Base64-encoded image content
 * @param language Language hint for analysis
 * @returns Object containing labels and web entities from the analysis
 */
export async function analyzeImage(imageBase64: string, language: string): Promise<VisionAnalysisResult> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Google API key missing");
  }

  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
    {
      requests: [
        {
          image: { content: imageBase64 },
          features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "WEB_DETECTION", maxResults: 20 }
          ],
          imageContext: {
            languageHints: [language]
          }
        }
      ]
    }
  );

  const labels = response.data.responses[0]?.labelAnnotations || [];
  const webEntities = response.data.responses[0]?.webDetection?.webEntities || [];

  return { labels, webEntities };
}

/**
 * Filters label results to find potential insect matches
 * @param labels Array of labels from Vision API
 * @param webEntities Array of web entities from Vision API
 * @returns Filtered array of insect-related labels
 */
export function filterInsectLabels(labels: any[], webEntities: any[]): any[] {
  return [...labels, ...webEntities].filter((label: any) => {
    const description = label.description.toLowerCase();
    if (["insect", "bug", "pest"].includes(description)) {
      return false;
    }
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
      description.includes('termite') ||
      description.includes('tick')
    );
  });
}