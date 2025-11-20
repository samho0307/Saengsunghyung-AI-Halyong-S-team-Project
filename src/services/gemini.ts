// Google Gemini API Client
// Documentation: https://ai.google.dev/gemini-api/docs/imagen?hl=ko

const GEMINI_API_KEY = "AIzaSyCvqHmcvZcN7DUVlaGnEIRi2XqrkOcngoU"; // TODO: Replace with actual API Key
const IMAGEN_MODEL = "imagen-3.0-generate-002";
const CHAT_MODEL = "gemini-1.5-flash";

interface GenerateImageResponse {
  success: boolean;
  imageUri?: string; // Data URI (base64)
  error?: string;
}

interface ChatResponse {
  success: boolean;
  text: string;
  emotion?: string;
  error?: string;
}

export const gemini = {
  /**
   * Generate Avatar Image using Imagen 3
   */
  generateAvatar: async (prompt: string): Promise<GenerateImageResponse> => {
    if (GEMINI_API_KEY === "AIzaSyCvqHmcvZcN7DUVlaGnEIRi2XqrkOcngoU") {
      console.warn("⚠️ Gemini API Key가 설정되지 않았습니다.");
      return { success: false, error: "API Key Missing" };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${GEMINI_API_KEY}`;
    
    // Optimize prompt for virtual character generation
    const enhancedPrompt = `A high-quality 2D vector art character design. ${prompt}. White background, centered, distinct personality, friendly virtual companion style.`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: enhancedPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            // personGeneration: "allow_adult" // Optional based on region
          }
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Image generation failed");
      }

      // Imagen returns base64 encoded image in predictions[0].bytesBase64Encoded
      const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
      
      if (base64Image) {
        return {
          success: true,
          imageUri: `data:image/png;base64,${base64Image}`
        };
      }
      
      throw new Error("No image data received");

    } catch (error: any) {
      console.error("[Gemini Imagen Error]", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Chat with Avatar using Gemini Pro
   */
  chat: async (userMessage: string): Promise<ChatResponse> => {
    if (GEMINI_API_KEY === "AIzaSyCvqHmcvZcN7DUVlaGnEIRi2XqrkOcngoU") {
      // Fallback for testing without key
      return { success: true, text: `(Mock) "${userMessage}"라고? 재밌네!`, emotion: 'happy' };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `
              You are a friendly virtual friend (AI character). 
              The user has created you to be their companion.
              Respond to the user's message in Korean. 
              Act like a real friend with a distinct personality.
              Keep it short (under 2 sentences).
              Analyze the user's emotion and include it at the end in brackets like [happy], [sad], [neutral], [surprised], [angry].
              
              User: ${userMessage}
            ` }]
          }]
        })
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) {
        // Extract emotion tag
        let emotion = 'neutral';
        const cleanText = content.replace(/\[(happy|sad|neutral|surprised|angry)\]/g, (match: string) => {
          emotion = match.slice(1, -1); // remove brackets
          return '';
        }).trim();

        return { success: true, text: cleanText, emotion };
      }

      throw new Error("No chat response");

    } catch (error: any) {
      console.error("[Gemini Chat Error]", error);
      return { success: false, text: "오류가 발생했어요.", error: error.message };
    }
  }
};

