

// Google Gemini API Client
// Documentation (Gemini 3): https://ai.google.dev/gemini-api/docs/gemini-3?hl=ko
// Documentation (Image): https://ai.google.dev/gemini-api/docs/image-generation?hl=ko

const GEMINI_API_KEY = ""; 

// Models
// Primary: Gemini 3 Pro Image Preview (as requested by user)
// Backup: Gemini 2.5 Flash Image (Nano Banana)
// Vision: Gemini 1.5 Flash (for image analysis)
const PRIMARY_IMAGE_MODEL = "gemini-3-pro-image-preview";
const FALLBACK_IMAGE_MODEL = "gemini-2.5-flash-image";
const VISION_MODEL = "gemini-1.5-flash";

// Chat Model
const CHAT_MODEL = "gemini-3-pro-preview";

interface GenerateImageResponse {
  success: boolean;
  imageUri?: string; // Data URI (base64)
  error?: string;
  usedModel?: string;
}

interface ChatResponse {
  success: boolean;
  text: string;
  emotion?: string;
  error?: string;
}

export const gemini = {
  /**
   * Internal helper to call image generation API
   */
  _callImageApi: async (model: string, prompt: string): Promise<GenerateImageResponse> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    // Optimize prompt for virtual character generation
    // Added explicit instruction for Dark Midnight Blue background to match App Theme (#1a1a2e)
    const enhancedPrompt = `Create a high-quality 3D rendered character, full body shot (head to toe). ${prompt}. Isolated on a solid dark midnight blue background (Hex Color #1a1a2e). The background must be a flat, uniform dark navy color matching #1a1a2e exactly. No gradients, no spotlight effects, no shadows on background. High fidelity, friendly virtual friend style.`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: enhancedPrompt }]
            }],
            // generationConfig removal for compatibility with both models if needed,
            // but usually responseMimeType is not strictly required for image models if defaults are fine.
        }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error?.message || `Failed to generate with ${model}`);
    }

    // Gemini Image Generation returns inlineData in parts
    const parts = data.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return {
                    success: true,
                    imageUri: `data:image/png;base64,${part.inlineData.data}`,
                    usedModel: model
                };
            }
        }
    }
    
    throw new Error("No image data received from API.");
  },

  /**
   * Process image for background removal (Mock/Placeholder)
   * In a real app, this would call a service like remove.bg
   */
  removeBackground: async (imageUri: string): Promise<string> => {
    // TODO: Integrate with actual Background Removal API (e.g., remove.bg) if user provides key
    // For now, we rely on the generation prompt ensuring a solid black background which matches the UI.
    console.log("Simulating background removal process...");
    
    // Artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return imageUri;
  },

  /**
   * Analyze an image and return a description
   * Used for "Image -> Character" generation flow
   */
  analyzeImage: async (base64Image: string): Promise<string> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Describe the physical appearance of the character/person in this image in detail (hair, eye color, clothing style, gender, accessories) so I can recreate them as a 3D avatar. Keep it concise and descriptive." },
              { 
                inlineData: {
                  mimeType: "image/jpeg", // Assuming jpeg for simplicity, or detect from picker
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error?.message || "Image analysis failed");
      }

      const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return description || "A character from uploaded image";

    } catch (error: any) {
      console.error("[Gemini Vision Error]", error);
      throw new Error("Failed to analyze image");
    }
  },

  /**
   * Generate Avatar Image with Fallback Logic
   */
  generateAvatar: async (prompt: string): Promise<GenerateImageResponse> => {
    try {
        console.log(`Attempting generation with ${PRIMARY_IMAGE_MODEL}...`);
        return await gemini._callImageApi(PRIMARY_IMAGE_MODEL, prompt);
    } catch (error: any) {
        console.warn(`[Gemini] Primary model ${PRIMARY_IMAGE_MODEL} failed:`, error.message);
        console.log(`Falling back to ${FALLBACK_IMAGE_MODEL}...`);
        
        try {
            return await gemini._callImageApi(FALLBACK_IMAGE_MODEL, prompt);
        } catch (fallbackError: any) {
            console.error(`[Gemini] Fallback model ${FALLBACK_IMAGE_MODEL} also failed:`, fallbackError.message);
            return { 
                success: false, 
                error: `All models failed. Last error: ${fallbackError.message}` 
            };
        }
    }
  },

  /**
   * Chat with Avatar using Gemini 3 Pro
   */
  chat: async (userMessage: string, userContext?: any, systemPromptOverride?: string): Promise<ChatResponse> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Construct System Instruction based on User Context (Preferences)
    // If systemPromptOverride is provided (e.g. for Story Mode), use it as base.
    let systemInstruction = systemPromptOverride ? systemPromptOverride : `
      You are a friendly virtual friend (AI character). 
      The user has created you to be their companion.
      Respond to the user's message in Korean. 
      Act like a real friend with a distinct personality.
      Keep it short (under 2 sentences).
      Analyze the user's emotion and include it at the end in brackets like [happy], [sad], [neutral], [surprised], [angry].
    `;

    if (userContext) {
      const { nickname, interests, mbti, communicationStyle } = userContext;
      
      systemInstruction += `
        \n[User Profile]
        - User's Nickname: ${nickname || 'User'}
        - User's Interests: ${interests?.join(', ') || 'General'}
        - User's MBTI: ${mbti || 'Unknown'}
        - Preferred Communication Style: ${communicationStyle || 'Casual'}
      `;

      if (communicationStyle === 'formal') {
        systemInstruction += `\nPlease use polite Korean (존댓말/Honorifics).`;
      } else if (communicationStyle === 'cute') {
         systemInstruction += `\nPlease use a cute, affectionate tone with emojis.`;
      } else {
         systemInstruction += `\nPlease use casual Korean (반말) like a close friend.`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `
              ${systemInstruction}
              
              User: ${userMessage}
            ` }]
          }],
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMessage = data.error?.message || "Chat generation failed.";
        console.error("[Gemini Chat Error]", errorMessage);
        return { success: false, text: "Gemini 3 연결 실패.", error: errorMessage };
      }

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (content) {
        let emotion = 'neutral';
        const cleanText = content.replace(/\[(happy|sad|neutral|surprised|angry)\]/g, (match: string) => {
          emotion = match.slice(1, -1);
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
