import { useCallback } from 'react'
import { useAvatarStore } from '../store/avatarStore'

export type EmotionType = 'happy' | 'sad' | 'excited' | 'thoughtful' | 'playful' | 'neutral'

interface EmotionMapping {
  expression: string
  intensity: number
  duration: number
  animation?: string
}

/**
 * 채팅 메시지의 감정을 아바타 표정으로 매핑하는 커스텀 훅
 */
export function useEmotionMapper() {
  const { setCurrentEmotion } = useAvatarStore()

  // 감정 매핑 테이블
  const emotionMappings: Record<EmotionType, EmotionMapping> = {
    happy: {
      expression: 'smile',
      intensity: 0.8,
      duration: 3000,
      animation: 'bounce-subtle'
    },
    excited: {
      expression: 'big-smile',
      intensity: 1.0,
      duration: 4000,
      animation: 'bounce-subtle'
    },
    playful: {
      expression: 'wink',
      intensity: 0.7,
      duration: 2500,
      animation: 'wiggle'
    },
    sad: {
      expression: 'frown',
      intensity: 0.6,
      duration: 4000,
      animation: 'fade-in'
    },
    thoughtful: {
      expression: 'thinking',
      intensity: 0.5,
      duration: 5000,
      animation: 'slow-nod'
    },
    neutral: {
      expression: 'neutral',
      intensity: 0.3,
      duration: 2000,
      animation: 'fade-in'
    }
  }

  /**
   * 텍스트에서 감정을 분석하여 아바타 표정을 업데이트
   */
  const mapTextToEmotion = useCallback((text: string): EmotionType => {
    const lowerText = text.toLowerCase()
    
    // 감정 키워드 매핑
    const emotionKeywords = {
      happy: [
        'happy', 'joy', 'great', 'awesome', 'wonderful', 'amazing', 'love', 'smile',
        '행복', '기쁘', '좋', '멋지', '훌륭', '최고', '사랑', '웃음', '😊', '😄', '😁'
      ],
      excited: [
        'excited', 'wow', 'incredible', 'fantastic', 'brilliant', 'omg', 'amazing',
        '흥미진진', '와', '대박', '놀라', '환상적', '믿을 수 없', '😍', '🤩', '🎉'
      ],
      playful: [
        'haha', 'lol', 'funny', 'silly', 'joke', 'play', 'fun', 'tease',
        '하하', 'ㅋㅋ', '웃기', '재미', '장난', '놀', '농담', '😂', '😜', '😋'
      ],
      sad: [
        'sad', 'sorry', 'disappointed', 'upset', 'down', 'blue', 'hurt',
        '슬프', '미안', '실망', '우울', '속상', '아프', '😢', '😞', '😔'
      ],
      thoughtful: [
        'think', 'consider', 'wonder', 'perhaps', 'maybe', 'interesting', 'hmm',
        '생각', '고민', '궁금', '아마', '흥미', '음', '🤔', '💭'
      ]
    }
    
    // 키워드 매칭으로 감정 분석
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion as EmotionType
      }
    }
    
    // 문장 부호로 감정 추측
    if (text.includes('!') && text.includes('?')) {
      return 'excited'
    } else if (text.includes('!!') || text.includes('!!!')) {
      return 'excited'
    } else if (text.includes('?')) {
      return 'thoughtful'
    } else if (text.includes('...')) {
      return 'thoughtful'
    }
    
    return 'neutral'
  }, [])

  /**
   * 감정을 아바타에 적용
   */
  const applyEmotionToAvatar = useCallback((emotion: EmotionType) => {
    const mapping = emotionMappings[emotion]
    
    // 아바타 상태 업데이트
    setCurrentEmotion(emotion)
    
    // 애니메이션 효과 (실제 구현에서는 PixiJS나 Canvas 애니메이션)
    console.log(`Applying emotion: ${emotion}`, mapping)
    
    // TODO: 실제 아바타 애니메이션 적용
    // - 표정 변화 (입, 눈, 눈썹)
    // - 머리 움직임
    // - 바디 랭귀지
    // - 색상 오버레이
    
    return mapping
  }, [setCurrentEmotion])

  /**
   * 텍스트를 분석하여 아바타 감정을 자동 업데이트
   */
  const updateEmotionFromText = useCallback((text: string) => {
    const emotion = mapTextToEmotion(text)
    return applyEmotionToAvatar(emotion)
  }, [mapTextToEmotion, applyEmotionToAvatar])

  /**
   * 감정 강도에 따른 애니메이션 지속시간 계산
   */
  const calculateAnimationDuration = useCallback((emotion: EmotionType, baseIntensity = 1.0): number => {
    const mapping = emotionMappings[emotion]
    return mapping.duration * baseIntensity
  }, [])

  /**
   * 여러 감정이 섞인 텍스트 분석
   */
  const analyzeComplexEmotion = useCallback((text: string): { 
    primary: EmotionType
    secondary?: EmotionType
    confidence: number 
  } => {
    const emotions: Array<{ emotion: EmotionType; score: number }> = []
    
    Object.keys(emotionMappings).forEach(emotion => {
      const score = calculateEmotionScore(text, emotion as EmotionType)
      if (score > 0) {
        emotions.push({ emotion: emotion as EmotionType, score })
      }
    })
    
    emotions.sort((a, b) => b.score - a.score)
    
    return {
      primary: emotions[0]?.emotion || 'neutral',
      secondary: emotions[1]?.emotion,
      confidence: emotions[0]?.score || 0
    }
  }, [])

  /**
   * 특정 감정에 대한 텍스트 점수 계산
   */
  const calculateEmotionScore = (text: string, emotion: EmotionType): number => {
    const lowerText = text.toLowerCase()
    let score = 0
    
    // 간단한 키워드 기반 점수 계산
    const keywords = {
      happy: ['happy', 'joy', 'good', 'great', '좋', '행복', '기쁘'],
      excited: ['wow', 'amazing', 'incredible', '와', '대박', '놀라'],
      playful: ['haha', 'funny', 'lol', '하하', 'ㅋㅋ', '웃기'],
      sad: ['sad', 'sorry', 'bad', '슬프', '미안', '나쁘'],
      thoughtful: ['think', 'maybe', 'perhaps', '생각', '아마', '음'],
      neutral: []
    }
    
    const emotionKeywords = keywords[emotion] || []
    emotionKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 1
      }
    })
    
    return score
  }

  return {
    mapTextToEmotion,
    applyEmotionToAvatar,
    updateEmotionFromText,
    calculateAnimationDuration,
    analyzeComplexEmotion,
    emotionMappings
  }
}
