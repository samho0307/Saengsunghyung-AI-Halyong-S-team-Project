import React, { useEffect, useRef } from 'react'
import { useAvatarStore } from '../store/avatarStore'
import { LoadingSpinner } from './LoadingSpinner'

export function AvatarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { 
    avatarImageUrl, 
    currentEmotion, 
    isGeneratingAvatar,
    appearance 
  } = useAvatarStore()

  // 간단한 캔버스 렌더링 (실제로는 PixiJS나 더 복잡한 렌더링 로직이 들어갈 예정)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (avatarImageUrl) {
      // 실제 아바타 이미지가 있을 때
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // 감정에 따른 간단한 오버레이 효과
        drawEmotionOverlay(ctx, currentEmotion, canvas.width, canvas.height)
      }
      img.src = avatarImageUrl
    } else {
      // 플레이스홀더 아바타 그리기
      drawPlaceholderAvatar(ctx, canvas.width, canvas.height, appearance, currentEmotion)
    }
  }, [avatarImageUrl, currentEmotion, appearance])

  const drawPlaceholderAvatar = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    appearance: any,
    emotion: string
  ) => {
    // 배경
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // 간단한 아바타 실루엣
    const centerX = width / 2
    const centerY = height / 2

    // 머리
    ctx.fillStyle = getSkinColor(appearance.skinTone)
    ctx.beginPath()
    ctx.arc(centerX, centerY - 40, 60, 0, Math.PI * 2)
    ctx.fill()

    // 몸
    ctx.fillStyle = getOutfitColor(appearance.outfitStyle)
    ctx.fillRect(centerX - 40, centerY + 20, 80, 100)

    // 얼굴 표정
    drawFacialExpression(ctx, centerX, centerY - 40, emotion)

    // 머리카락
    ctx.fillStyle = getHairColor(appearance.hairColor)
    drawHair(ctx, centerX, centerY - 40, appearance.hairStyle)

    // 텍스트 오버레이
    ctx.fillStyle = '#64748b'
    ctx.font = '14px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('AI 아바타 생성 대기중...', centerX, height - 20)
  }

  const drawEmotionOverlay = (
    ctx: CanvasRenderingContext2D,
    emotion: string,
    width: number,
    height: number
  ) => {
    // 감정에 따른 색상 오버레이
    const emotionColors = {
      happy: 'rgba(255, 235, 59, 0.1)',
      excited: 'rgba(255, 152, 0, 0.1)',
      playful: 'rgba(233, 30, 99, 0.1)',
      sad: 'rgba(96, 125, 139, 0.1)',
      thoughtful: 'rgba(103, 58, 183, 0.1)',
      neutral: 'rgba(158, 158, 158, 0.05)'
    }

    ctx.fillStyle = emotionColors[emotion as keyof typeof emotionColors] || emotionColors.neutral
    ctx.fillRect(0, 0, width, height)
  }

  const drawFacialExpression = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    emotion: string
  ) => {
    ctx.fillStyle = '#1f2937'
    
    // 눈
    ctx.beginPath()
    ctx.arc(centerX - 15, centerY - 10, 3, 0, Math.PI * 2)
    ctx.arc(centerX + 15, centerY - 10, 3, 0, Math.PI * 2)
    ctx.fill()

    // 입 (감정에 따라 다르게)
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#1f2937'
    
    switch (emotion) {
      case 'happy':
      case 'excited':
        ctx.arc(centerX, centerY + 5, 15, 0, Math.PI) // 웃는 입
        break
      case 'sad':
        ctx.arc(centerX, centerY + 20, 15, Math.PI, 0) // 슬픈 입
        break
      case 'playful':
        ctx.arc(centerX, centerY + 5, 10, 0, Math.PI) // 작은 미소
        break
      default:
        ctx.moveTo(centerX - 10, centerY + 10)
        ctx.lineTo(centerX + 10, centerY + 10) // 일반 입
    }
    ctx.stroke()
  }

  const drawHair = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    hairStyle: string
  ) => {
    ctx.beginPath()
    switch (hairStyle) {
      case 'short':
        ctx.arc(centerX, centerY, 65, Math.PI, 0)
        break
      case 'long':
        ctx.arc(centerX, centerY, 70, Math.PI, 0)
        ctx.fillRect(centerX - 70, centerY, 140, 50)
        break
      default:
        ctx.arc(centerX, centerY, 65, Math.PI, 0)
    }
    ctx.fill()
  }

  const getSkinColor = (skinTone: string) => {
    const colors = {
      light: '#fdbcb4',
      medium: '#e0ac69',
      tan: '#c68642',
      dark: '#8d5524'
    }
    return colors[skinTone as keyof typeof colors] || colors.medium
  }

  const getHairColor = (hairColor: string) => {
    const colors = {
      black: '#1a1a1a',
      brown: '#8b4513',
      blonde: '#ffd700',
      red: '#dc143c',
      blue: '#4169e1',
      pink: '#ff69b4'
    }
    return colors[hairColor as keyof typeof colors] || colors.brown
  }

  const getOutfitColor = (outfitStyle: string) => {
    const colors = {
      casual: '#6b7280',
      formal: '#1f2937',
      sporty: '#3b82f6',
      trendy: '#ec4899',
      vintage: '#92400e'
    }
    return colors[outfitStyle as keyof typeof colors] || colors.casual
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        아바타 미리보기
      </h3>
      
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
        {isGeneratingAvatar && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
            <LoadingSpinner size="lg" text="아바타 생성 중..." />
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={300}
          height={400}
          className="w-full h-auto max-w-sm mx-auto block"
        />
        
        {/* 감정 상태 표시 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          <span className="text-gray-600">감정: </span>
          <span className="font-medium">
            {currentEmotion === 'happy' && '😊 행복'}
            {currentEmotion === 'excited' && '🤩 흥분'}
            {currentEmotion === 'playful' && '😜 장난스러움'}
            {currentEmotion === 'sad' && '😢 슬픔'}
            {currentEmotion === 'thoughtful' && '🤔 생각중'}
            {currentEmotion === 'neutral' && '😐 평온'}
          </span>
        </div>
      </div>

      {/* 아바타 정보 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-2">
          <div>성별: {appearance.gender === 'female' ? '여성' : appearance.gender === 'male' ? '남성' : '논바이너리'}</div>
          <div>키: {appearance.height}/10</div>
          <div>체형: {appearance.bodyType}</div>
          <div>스타일: {appearance.outfitStyle}</div>
        </div>
      </div>
    </div>
  )
}
