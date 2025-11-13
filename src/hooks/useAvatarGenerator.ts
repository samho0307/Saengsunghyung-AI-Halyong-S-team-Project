import { useState, useCallback } from 'react'
import { useAvatarStore } from '../store/avatarStore'
import { buildAvatarPrompt } from '../utils/promptBuilder'

interface UseAvatarGeneratorReturn {
  generateAvatar: () => Promise<void>
  isGenerating: boolean
  error: string | null
}

/**
 * 아바타 생성을 위한 커스텀 훅
 * NanoBanana Image API를 사용하여 아바타를 생성합니다.
 */
export function useAvatarGenerator(): UseAvatarGeneratorReturn {
  const [error, setError] = useState<string | null>(null)
  
  const { 
    appearance, 
    personality, 
    referenceImage,
    isGeneratingAvatar,
    setGeneratingAvatar,
    setAvatarImageUrl
  } = useAvatarStore()

  const generateAvatar = useCallback(async () => {
    if (isGeneratingAvatar) return

    setGeneratingAvatar(true)
    setError(null)

    try {
      // 프롬프트 생성
      const prompt = buildAvatarPrompt(appearance, personality, referenceImage || undefined)
      
      // TODO: 실제 NanoBanana Image API 호출
      // const response = await fetch('/api/nanobana/image', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     prompt,
      //     referenceImage,
      //     style: 'anime-2d',
      //     quality: 'high'
      //   })
      // })
      
      // if (!response.ok) {
      //   throw new Error('아바타 생성에 실패했습니다.')
      // }
      
      // const data = await response.json()
      // setAvatarImageUrl(data.imageUrl)

      // 현재는 더미 구현
      console.log('Generated prompt:', prompt)
      
      // 시뮬레이션 지연
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
      
      // 더미 이미지 URL 생성
      const seed = encodeURIComponent(JSON.stringify({ appearance, personality }))
      const dummyImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
      
      setAvatarImageUrl(dummyImageUrl)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('Avatar generation error:', err)
    } finally {
      setGeneratingAvatar(false)
    }
  }, [
    appearance, 
    personality, 
    referenceImage, 
    isGeneratingAvatar, 
    setGeneratingAvatar, 
    setAvatarImageUrl
  ])

  return {
    generateAvatar,
    isGenerating: isGeneratingAvatar,
    error
  }
}

/**
 * 아바타 이미지 캐싱을 위한 유틸리티
 */
export function getCachedAvatarKey(appearance: any, personality: any): string {
  return btoa(JSON.stringify({ appearance, personality }))
}

/**
 * 로컬 스토리지에서 캐시된 아바타 확인
 */
export function getCachedAvatar(key: string): string | null {
  try {
    const cached = localStorage.getItem(`avatar_cache_${key}`)
    if (cached) {
      const data = JSON.parse(cached)
      // 24시간 캐시
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return data.imageUrl
      }
    }
  } catch (error) {
    console.warn('Failed to get cached avatar:', error)
  }
  return null
}

/**
 * 아바타를 로컬 스토리지에 캐시
 */
export function setCachedAvatar(key: string, imageUrl: string): void {
  try {
    const data = {
      imageUrl,
      timestamp: Date.now()
    }
    localStorage.setItem(`avatar_cache_${key}`, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to cache avatar:', error)
  }
}
