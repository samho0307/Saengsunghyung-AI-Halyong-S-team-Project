import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 아바타 외형 설정 인터페이스
export interface AvatarAppearance {
  skinTone: 'light' | 'medium' | 'dark' | 'tan'
  bodyType: 'slim' | 'average' | 'athletic' | 'curvy'
  gender: 'male' | 'female' | 'non-binary'
  height: number // 1-10 scale
  outfitStyle: 'casual' | 'formal' | 'sporty' | 'trendy' | 'vintage'
  facialStyle: 'soft' | 'sharp' | 'round' | 'angular'
  hairStyle: 'short' | 'medium' | 'long' | 'curly' | 'straight'
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'blue' | 'pink'
}

// 성격 특성 인터페이스
export interface PersonalityTraits {
  energy: number // 1-10: calm to energetic
  sociability: number // 1-10: shy to outgoing
  creativity: number // 1-10: logical to creative
  humor: number // 1-10: serious to playful
  empathy: number // 1-10: analytical to emotional
  confidence: number // 1-10: modest to confident
}

// 채팅 메시지 인터페이스
export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'avatar'
  timestamp: Date
  emotion?: 'happy' | 'sad' | 'excited' | 'thoughtful' | 'playful' | 'neutral'
}

// 아바타 상태 인터페이스
interface AvatarState {
  // 아바타 외형
  appearance: AvatarAppearance
  
  // 성격 특성
  personality: PersonalityTraits
  
  // 생성된 아바타 이미지 URL
  avatarImageUrl: string | null
  
  // 채팅 메시지들
  chatMessages: ChatMessage[]
  
  // 현재 아바타 감정 상태
  currentEmotion: 'happy' | 'sad' | 'excited' | 'thoughtful' | 'playful' | 'neutral'
  
  // 로딩 상태
  isGeneratingAvatar: boolean
  isChatting: boolean
  
  // 업로드된 참조 이미지
  referenceImage: string | null
  
  // Actions
  updateAppearance: (appearance: Partial<AvatarAppearance>) => void
  updatePersonality: (personality: Partial<PersonalityTraits>) => void
  setAvatarImageUrl: (url: string | null) => void
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChatHistory: () => void
  setCurrentEmotion: (emotion: AvatarState['currentEmotion']) => void
  setGeneratingAvatar: (isGenerating: boolean) => void
  setChatting: (isChatting: boolean) => void
  setReferenceImage: (image: string | null) => void
  resetAvatar: () => void
}

// 기본 아바타 설정
const defaultAppearance: AvatarAppearance = {
  skinTone: 'medium',
  bodyType: 'average',
  gender: 'female',
  height: 5,
  outfitStyle: 'casual',
  facialStyle: 'soft',
  hairStyle: 'medium',
  hairColor: 'brown'
}

// 기본 성격 특성
const defaultPersonality: PersonalityTraits = {
  energy: 5,
  sociability: 5,
  creativity: 5,
  humor: 5,
  empathy: 5,
  confidence: 5
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      appearance: defaultAppearance,
      personality: defaultPersonality,
      avatarImageUrl: null,
      chatMessages: [],
      currentEmotion: 'neutral',
      isGeneratingAvatar: false,
      isChatting: false,
      referenceImage: null,

      // Actions
      updateAppearance: (newAppearance) =>
        set((state) => ({
          appearance: { ...state.appearance, ...newAppearance }
        })),

      updatePersonality: (newPersonality) =>
        set((state) => ({
          personality: { ...state.personality, ...newPersonality }
        })),

      setAvatarImageUrl: (url) => set({ avatarImageUrl: url }),

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date()
            }
          ]
        })),

      clearChatHistory: () => set({ chatMessages: [] }),

      setCurrentEmotion: (emotion) => set({ currentEmotion: emotion }),

      setGeneratingAvatar: (isGenerating) => set({ isGeneratingAvatar: isGenerating }),

      setChatting: (isChatting) => set({ isChatting }),

      setReferenceImage: (image) => set({ referenceImage: image }),

      resetAvatar: () =>
        set({
          appearance: defaultAppearance,
          personality: defaultPersonality,
          avatarImageUrl: null,
          chatMessages: [],
          currentEmotion: 'neutral',
          referenceImage: null
        })
    }),
    {
      name: 'avatar-storage',
      // 민감한 데이터는 저장하지 않음
      partialize: (state) => ({
        appearance: state.appearance,
        personality: state.personality,
        chatMessages: state.chatMessages.slice(-50) // 최근 50개 메시지만 저장
      })
    }
  )
)
