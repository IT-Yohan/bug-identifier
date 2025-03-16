import axios from "axios";

/**
 * Translates text to the specified language using Google Translation API
 * @param text Text to translate
 * @param targetLanguage Target language code (e.g., 'fr', 'es')
 * @returns Translated text
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Google API key missing");
  }

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        q: text,
        target: targetLanguage
      }
    );

    if (response.data?.data?.translations?.length > 0) {
      return response.data.data.translations[0].translatedText;
    }
    
    // If no translation is available, return the original text
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    // Return original text as fallback if translation fails
    return text;
  }
}