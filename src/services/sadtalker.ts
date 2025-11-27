import { Alert } from 'react-native';

// Replicate API Configuration
// TODO: User needs to provide REPLICATE_API_TOKEN
const REPLICATE_API_TOKEN = "YOUR_REPLICATE_API_TOKEN"; 

// SadTalker Model Version on Replicate
const SADTALKER_VERSION = "3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376";

interface SadTalkerInput {
  source_image: string; // URL of the avatar image
  driven_audio: string; // URL of the audio file
  enhancer?: 'gfpgan' | 'RestoreFormer';
  preprocess?: 'crop' | 'resize' | 'full';
  still?: boolean;
}

interface PredictionResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string; // URL of the generated video
  error?: string;
}

export const sadtalker = {
  /**
   * Generate a Talking Head Video using SadTalker via Replicate
   * @param imageUrl URL of the source image (Avatar)
   * @param audioUrl URL of the audio file (TTS output)
   */
  generateVideo: async (imageUrl: string, audioUrl: string): Promise<string | null> => {
    if (REPLICATE_API_TOKEN === "YOUR_REPLICATE_API_TOKEN") {
      console.warn("[SadTalker] Replicate API Token is missing.");
      Alert.alert("API Key Missing", "Please configure your Replicate API Token in src/services/sadtalker.ts");
      return null;
    }

    try {
      // 1. Create Prediction
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: SADTALKER_VERSION,
          input: {
            source_image: imageUrl,
            driven_audio: audioUrl,
            preprocess: "full", // Use full image
            still: true, // Keep original background/pose
            enhancer: "gfpgan"
          }
        }),
      });

      const data = await response.json();
      
      if (response.status !== 201) {
        throw new Error(data.detail || "Failed to start prediction");
      }

      const predictionId = data.id;
      let status = data.status;
      let output = null;

      // 2. Poll for completion
      while (status !== "succeeded" && status !== "failed" && status !== "canceled") {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        
        const pollData = await pollResponse.json();
        status = pollData.status;
        
        if (status === "succeeded") {
          output = pollData.output;
        } else if (status === "failed") {
            throw new Error(pollData.error || "Prediction failed");
        }
      }

      return output;

    } catch (error) {
      console.error("[SadTalker Error]", error);
      Alert.alert("Video Generation Failed", "Could not generate talking head video.");
      return null;
    }
  }
};


