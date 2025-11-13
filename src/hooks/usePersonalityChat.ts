import { useState, useCallback } from 'react'
import { useAvatarStore } from '../store/avatarStore'
import { buildChatSystemPrompt, analyzeMessageEmotion } from '../utils/promptBuilder'

interface UsePersonalityChatReturn {
  sendMessage: (message: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * 성격 기반 채팅을 위한 커스텀 훅
 * NanoBanana Text API를 사용하여 아바타의 성격에 맞는 응답을 생성합니다.
 */
export function usePersonalityChat(): UsePersonalityChatReturn {
  const [error, setError] = useState<string | null>(null)
  
  const { 
    personality,
    chatMessages,
    addChatMessage,
    isChatting,
    setChatting,
    setCurrentEmotion
  } = useAvatarStore()

  const sendMessage = useCallback(async (userMessage: string) => {
    if (isChatting || !userMessage.trim()) return

    setChatting(true)
    setError(null)

    // 사용자 메시지 추가
    addChatMessage({
      content: userMessage.trim(),
      sender: 'user'
    })

    try {
      // 시스템 프롬프트 생성
      const systemPrompt = buildChatSystemPrompt(personality)
      
      // 대화 컨텍스트 구성 (최근 5개 메시지)
      const recentMessages = chatMessages.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      // TODO: 실제 NanoBanana Text API 호출
      // const response = await fetch('/api/nanobana/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     systemPrompt,
      //     messages: [
      //       ...recentMessages,
      //       { role: 'user', content: userMessage }
      //     ],
      //     personality,
      //     maxTokens: 150,
      //     temperature: 0.8
      //   })
      // })
      
      // if (!response.ok) {
      //   throw new Error('채팅 응답 생성에 실패했습니다.')
      // }
      
      // const data = await response.json()
      // const avatarResponse = data.message

      // 현재는 더미 구현
      console.log('System prompt:', systemPrompt)
      console.log('Recent messages:', recentMessages)
      
      const avatarResponse = await generatePersonalityResponse(userMessage, personality)
      
      // 감정 분석
      const emotion = analyzeMessageEmotion(avatarResponse)
      
      // 아바타 응답 추가
      addChatMessage({
        content: avatarResponse,
        sender: 'avatar',
        emotion
      })
      
      // 아바타 감정 상태 업데이트
      setCurrentEmotion(emotion)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '응답 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      
      // 에러 메시지 추가
      addChatMessage({
        content: '죄송해요, 지금 응답할 수 없어요. 잠시 후 다시 시도해주세요.',
        sender: 'avatar',
        emotion: 'sad'
      })
      
      console.error('Chat error:', err)
    } finally {
      setChatting(false)
    }
  }, [
    personality,
    chatMessages,
    addChatMessage,
    isChatting,
    setChatting,
    setCurrentEmotion
  ])

  return {
    sendMessage,
    isLoading: isChatting,
    error
  }
}

/**
 * 성격 기반 더미 응답 생성 (실제 API로 교체 예정)
 */
async function generatePersonalityResponse(
  userMessage: string, 
  personality: any
): Promise<string> {
  // 시뮬레이션 지연
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const lowerMessage = userMessage.toLowerCase()
  
  // 성격 특성별 응답 템플릿
  const responseTemplates = {
    // 에너지 레벨
    highEnergy: [
      "와! 정말 흥미로운 이야기네요! 더 들려주세요!",
      "오 그래요?! 저도 그런 경험이 있어요!",
      "대박! 그거 정말 멋지네요!",
      "우와! 생각만 해도 신나네요!"
    ],
    lowEnergy: [
      "음... 그렇군요. 차분히 생각해보니 좋은 말씀이네요.",
      "아, 그런 일이 있으셨군요. 이해가 됩니다.",
      "흠... 조용히 생각해볼 만한 주제네요.",
      "그렇네요... 천천히 생각해보겠어요."
    ],
    
    // 사교성
    highSocial: [
      "저도 그런 생각을 해본 적이 있어요! 어떻게 생각하세요?",
      "정말요? 저랑 비슷한 경험을 하셨네요! 더 이야기해요!",
      "와, 그거 정말 재미있겠어요! 저도 참여하고 싶어요!",
      "그런 이야기 정말 좋아해요! 계속 들려주세요!"
    ],
    lowSocial: [
      "아... 네, 그렇군요.",
      "음, 잘 모르겠어요... 어려운 이야기네요.",
      "그런가요... 저는 잘...",
      "음... 그런 일이 있었군요."
    ],
    
    // 유머감각
    highHumor: [
      "하하! 그거 정말 웃기네요! 😄",
      "ㅋㅋㅋ 농담이죠? 아니면 정말 재미있는 일이네요!",
      "어머, 그거 완전 코미디 같은 상황이네요! 😂",
      "아 진짜요? 상상만 해도 웃겨요! ㅋㅋ"
    ],
    
    // 창의성
    highCreativity: [
      "오, 그거 정말 창의적인 아이디어네요!",
      "와, 상상력이 정말 풍부하시네요!",
      "그런 관점으로 생각해본 적이 없었는데, 흥미로워요!",
      "정말 독특한 생각이네요! 어떻게 그런 아이디어를 떠올리셨어요?"
    ],
    
    // 공감능력
    highEmpathy: [
      "아, 그런 기분이셨을 것 같아요. 이해가 돼요.",
      "정말 힘드셨겠어요. 괜찮으신가요?",
      "그런 상황이면 저도 같은 기분이었을 것 같아요.",
      "마음이 많이 아프셨을 것 같아요. 위로해드리고 싶어요."
    ],
    
    // 자신감
    highConfidence: [
      "저는 확실히 그렇게 생각해요!",
      "네, 맞아요! 저도 그 의견에 동의해요!",
      "그거 정말 좋은 생각이에요! 저도 그렇게 해보고 싶어요!",
      "확실히 그게 맞는 것 같아요!"
    ],
    lowConfidence: [
      "음... 잘 모르겠어요. 어떻게 생각하세요?",
      "그런가요? 저는 확신이 서지 않아서...",
      "아마도... 그럴 수도 있을 것 같아요.",
      "제가 맞게 이해한 건지 모르겠어요..."
    ]
  }
  
  // 성격에 따른 응답 풀 구성
  let responsePool: string[] = []
  
  if (personality.energy >= 7) responsePool.push(...responseTemplates.highEnergy)
  if (personality.energy <= 3) responsePool.push(...responseTemplates.lowEnergy)
  if (personality.sociability >= 7) responsePool.push(...responseTemplates.highSocial)
  if (personality.sociability <= 3) responsePool.push(...responseTemplates.lowSocial)
  if (personality.humor >= 7) responsePool.push(...responseTemplates.highHumor)
  if (personality.creativity >= 7) responsePool.push(...responseTemplates.highCreativity)
  if (personality.empathy >= 7) responsePool.push(...responseTemplates.highEmpathy)
  if (personality.confidence >= 7) responsePool.push(...responseTemplates.highConfidence)
  if (personality.confidence <= 3) responsePool.push(...responseTemplates.lowConfidence)
  
  // 특정 키워드에 대한 반응
  if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
    const greetings = personality.sociability >= 6 
      ? ["안녕하세요! 만나서 반가워요!", "안녕! 오늘 어떤 하루 보내고 계세요?"]
      : ["안녕하세요.", "네, 안녕하세요..."]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  if (lowerMessage.includes('고마') || lowerMessage.includes('감사')) {
    const thanks = personality.empathy >= 6
      ? ["천만에요! 도움이 되어서 기뻐요!", "별말씀을요! 언제든지 말씀하세요!"]
      : ["네, 별말씀을요.", "괜찮아요."]
    return thanks[Math.floor(Math.random() * thanks.length)]
  }
  
  // 기본 응답
  if (responsePool.length === 0) {
    responsePool = [
      "그렇군요. 흥미로운 이야기네요.",
      "아, 그런 일이 있으셨군요.",
      "음, 이해가 됩니다.",
      "좋은 말씀이네요."
    ]
  }
  
  return responsePool[Math.floor(Math.random() * responsePool.length)]
}
