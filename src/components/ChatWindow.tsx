import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, RotateCcw } from 'lucide-react'
import { useAvatarStore } from '../store/avatarStore'
import { LoadingSpinner } from './LoadingSpinner'
import { analyzeMessageEmotion } from '../utils/promptBuilder'

export function ChatWindow() {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    chatMessages, 
    addChatMessage, 
    clearChatHistory,
    isChatting,
    setChatting,
    setCurrentEmotion,
    personality
  } = useAvatarStore()

  // 메시지 목록 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatting) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // 사용자 메시지 추가
    addChatMessage({
      content: userMessage,
      sender: 'user'
    })

    setChatting(true)

    try {
      // TODO: 실제 NanoBanana API 호출로 교체
      // 현재는 더미 응답 생성
      const avatarResponse = await generateDummyResponse(userMessage, personality)
      
      // 아바타 응답 추가
      const emotion = analyzeMessageEmotion(avatarResponse)
      addChatMessage({
        content: avatarResponse,
        sender: 'avatar',
        emotion
      })
      
      // 아바타 감정 상태 업데이트
      setCurrentEmotion(emotion)
      
    } catch (error) {
      console.error('채팅 오류:', error)
      addChatMessage({
        content: '죄송해요, 지금 응답할 수 없어요. 잠시 후 다시 시도해주세요.',
        sender: 'avatar',
        emotion: 'sad'
      })
    } finally {
      setChatting(false)
      inputRef.current?.focus()
    }
  }

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 채팅 기록 초기화
  const handleClearChat = () => {
    clearChatHistory()
    setCurrentEmotion('neutral')
  }

  // 메시지 시간 포맷팅
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="card h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          아바타와 채팅
        </h3>
        <button
          onClick={handleClearChat}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="채팅 기록 초기화"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">아바타와 대화를 시작해보세요!</p>
            <p className="text-sm">
              아바타의 성격에 따라 다른 반응을 보일 거예요.
            </p>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.emotion && message.sender === 'avatar' && (
                      <span className="ml-2">
                        {message.emotion === 'happy' && '😊'}
                        {message.emotion === 'excited' && '🤩'}
                        {message.emotion === 'playful' && '😜'}
                        {message.emotion === 'sad' && '😢'}
                        {message.emotion === 'thoughtful' && '🤔'}
                        {message.emotion === 'neutral' && '😐'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 타이핑 인디케이터 */}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isChatting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isChatting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-4 py-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* 성격 힌트 */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
        <strong>💡 팁:</strong> 아바타는 설정된 성격 특성에 따라 다르게 반응합니다. 
        성격을 조정해서 다양한 대화 스타일을 경험해보세요!
      </div>
    </div>
  )
}

// 더미 응답 생성 함수 (실제로는 NanoBanana API로 교체)
async function generateDummyResponse(userMessage: string, personality: any): Promise<string> {
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const responses = {
    high_energy: [
      "와! 정말 흥미로운 이야기네요! 더 들려주세요!",
      "오 그래요?! 저도 그런 경험이 있어요!",
      "대박! 그거 정말 멋지네요!"
    ],
    low_energy: [
      "음... 그렇군요. 차분히 생각해보니 좋은 말씀이네요.",
      "아, 그런 일이 있으셨군요. 이해가 됩니다.",
      "흠... 조용히 생각해볼 만한 주제네요."
    ],
    high_social: [
      "저도 그런 생각을 해본 적이 있어요! 어떻게 생각하세요?",
      "정말요? 저랑 비슷한 경험을 하셨네요! 더 이야기해요!",
      "와, 그거 정말 재미있겠어요! 저도 참여하고 싶어요!"
    ],
    low_social: [
      "아... 네, 그렇군요.",
      "음, 잘 모르겠어요... 어려운 이야기네요.",
      "그런가요... 저는 잘..."
    ],
    high_humor: [
      "하하! 그거 정말 웃기네요! 😄",
      "ㅋㅋㅋ 농담이죠? 아니면 정말 재미있는 일이네요!",
      "어머, 그거 완전 코미디 같은 상황이네요! 😂"
    ]
  }
  
  // 성격에 따른 응답 선택
  let responsePool = []
  
  if (personality.energy >= 7) responsePool.push(...responses.high_energy)
  if (personality.energy <= 3) responsePool.push(...responses.low_energy)
  if (personality.sociability >= 7) responsePool.push(...responses.high_social)
  if (personality.sociability <= 3) responsePool.push(...responses.low_social)
  if (personality.humor >= 7) responsePool.push(...responses.high_humor)
  
  if (responsePool.length === 0) {
    responsePool = [
      "그렇군요. 흥미로운 이야기네요.",
      "아, 그런 일이 있으셨군요.",
      "음, 이해가 됩니다."
    ]
  }
  
  return responsePool[Math.floor(Math.random() * responsePool.length)]
}
