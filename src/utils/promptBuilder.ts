import { AvatarAppearance, PersonalityTraits } from '../store/avatarStore'

/**
 * 아바타 생성을 위한 프롬프트 빌더
 */
export function buildAvatarPrompt(
  appearance: AvatarAppearance,
  personality: PersonalityTraits,
  referenceImage?: string
): string {
  const personalityDescription = getPersonalityDescription(personality)
  
  const basePrompt = `Create a 2D anime-style avatar with ${appearance.skinTone} skin tone, ${appearance.bodyType} body type, ${appearance.gender} gender, wearing ${appearance.outfitStyle} outfit style.
The avatar has ${appearance.facialStyle} facial features, ${appearance.hairStyle} ${appearance.hairColor} hair.
Height scale: ${appearance.height}/10.

The avatar's expression should reflect a ${personalityDescription} personality.
Style: clean line art, soft color palette, subtle lighting, modern anime aesthetic.
Background: transparent or simple gradient.
High quality, detailed, professional character design.`

  if (referenceImage) {
    return `${basePrompt}\n\nReference image provided for style guidance.`
  }

  return basePrompt
}

/**
 * 성격 특성을 기반으로 채팅 시스템 프롬프트 생성
 */
export function buildChatSystemPrompt(personality: PersonalityTraits): string {
  const traits = analyzePersonalityTraits(personality)
  
  return `You are an AI avatar with the following personality traits:

Energy Level: ${traits.energyDescription}
Social Style: ${traits.socialDescription}  
Thinking Style: ${traits.thinkingDescription}
Humor Style: ${traits.humorDescription}
Emotional Style: ${traits.emotionalDescription}
Confidence Level: ${traits.confidenceDescription}

Respond in a way that consistently reflects these personality traits:
- Keep responses conversational and natural
- Match the energy level and social style described
- Use appropriate humor and emotional responses
- Stay in character throughout the conversation
- Responses should be 1-3 sentences typically
- Show personality through word choice, punctuation, and tone

Remember: You are a friendly AI avatar companion, not a formal assistant.`
}

/**
 * 성격 특성 분석 및 설명 생성
 */
function analyzePersonalityTraits(personality: PersonalityTraits) {
  return {
    energyDescription: getEnergyDescription(personality.energy),
    socialDescription: getSocialDescription(personality.sociability),
    thinkingDescription: getThinkingDescription(personality.creativity),
    humorDescription: getHumorDescription(personality.humor),
    emotionalDescription: getEmotionalDescription(personality.empathy),
    confidenceDescription: getConfidenceDescription(personality.confidence)
  }
}

/**
 * 전체적인 성격 설명 생성 (아바타 생성용)
 */
function getPersonalityDescription(personality: PersonalityTraits): string {
  const traits = []
  
  if (personality.energy >= 7) traits.push('energetic')
  else if (personality.energy <= 3) traits.push('calm')
  
  if (personality.sociability >= 7) traits.push('outgoing')
  else if (personality.sociability <= 3) traits.push('shy')
  
  if (personality.creativity >= 7) traits.push('creative')
  else if (personality.creativity <= 3) traits.push('logical')
  
  if (personality.humor >= 7) traits.push('playful')
  else if (personality.humor <= 3) traits.push('serious')
  
  if (personality.empathy >= 7) traits.push('empathetic')
  else if (personality.empathy <= 3) traits.push('analytical')
  
  if (personality.confidence >= 7) traits.push('confident')
  else if (personality.confidence <= 3) traits.push('modest')
  
  return traits.length > 0 ? traits.join(', ') : 'balanced'
}

// 개별 특성 설명 함수들
function getEnergyDescription(energy: number): string {
  if (energy >= 8) return 'Very energetic and enthusiastic, uses exclamation points and dynamic language'
  if (energy >= 6) return 'Moderately energetic, upbeat and positive in tone'
  if (energy >= 4) return 'Balanced energy, neither too excited nor too calm'
  if (energy >= 2) return 'Calm and measured, speaks thoughtfully'
  return 'Very calm and peaceful, uses gentle and soothing language'
}

function getSocialDescription(sociability: number): string {
  if (sociability >= 8) return 'Very outgoing, asks lots of questions, loves to chat and share'
  if (sociability >= 6) return 'Friendly and social, enjoys conversation and connection'
  if (sociability >= 4) return 'Moderately social, comfortable in conversation'
  if (sociability >= 2) return 'Somewhat reserved, speaks when spoken to'
  return 'Very shy and introverted, gives brief responses, needs encouragement'
}

function getThinkingDescription(creativity: number): string {
  if (creativity >= 8) return 'Highly creative, uses metaphors, imaginative language, thinks outside the box'
  if (creativity >= 6) return 'Creative and artistic, enjoys exploring ideas and possibilities'
  if (creativity >= 4) return 'Balanced between creative and logical thinking'
  if (creativity >= 2) return 'Practical and logical, focuses on facts and realistic solutions'
  return 'Very analytical and logical, precise language, data-driven responses'
}

function getHumorDescription(humor: number): string {
  if (humor >= 8) return 'Very playful and humorous, uses jokes, puns, and light teasing'
  if (humor >= 6) return 'Good sense of humor, enjoys wordplay and light jokes'
  if (humor >= 4) return 'Occasionally humorous, appreciates good jokes'
  if (humor >= 2) return 'Somewhat serious, rare but genuine humor'
  return 'Very serious and formal, rarely uses humor'
}

function getEmotionalDescription(empathy: number): string {
  if (empathy >= 8) return 'Highly empathetic, very emotionally aware, offers comfort and support'
  if (empathy >= 6) return 'Emotionally intelligent, shows care and understanding'
  if (empathy >= 4) return 'Balanced emotional responses, shows appropriate concern'
  if (empathy >= 2) return 'Somewhat analytical, focuses more on solutions than emotions'
  return 'Very analytical and objective, focuses on facts rather than feelings'
}

function getConfidenceDescription(confidence: number): string {
  if (confidence >= 8) return 'Very confident and assertive, speaks with authority and certainty'
  if (confidence >= 6) return 'Confident and self-assured, comfortable expressing opinions'
  if (confidence >= 4) return 'Moderately confident, balanced self-assurance'
  if (confidence >= 2) return 'Somewhat modest, occasionally uncertain or hesitant'
  return 'Very modest and humble, often uncertain, seeks validation'
}

/**
 * 메시지 감정 분석 (간단한 키워드 기반)
 */
export function analyzeMessageEmotion(message: string): 'happy' | 'sad' | 'excited' | 'thoughtful' | 'playful' | 'neutral' {
  const lowerMessage = message.toLowerCase()
  
  // 감정 키워드 매핑
  const emotionKeywords = {
    happy: ['happy', 'joy', 'great', 'awesome', 'wonderful', 'amazing', 'love', 'smile', '😊', '😄', '😁'],
    excited: ['excited', 'wow', 'incredible', 'fantastic', 'brilliant', '!', 'omg', '😍', '🤩', '🎉'],
    playful: ['haha', 'lol', 'funny', 'silly', 'joke', 'play', 'fun', '😂', '😜', '😋'],
    sad: ['sad', 'sorry', 'disappointed', 'upset', 'down', 'blue', '😢', '😞', '😔'],
    thoughtful: ['think', 'consider', 'wonder', 'perhaps', 'maybe', 'interesting', 'hmm', '🤔', '💭']
  }
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return emotion as any
    }
  }
  
  return 'neutral'
}
