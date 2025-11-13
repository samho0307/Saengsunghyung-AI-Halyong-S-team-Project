import React from 'react'
import { Palette, User, Shirt } from 'lucide-react'
import { useAvatarStore } from '../store/avatarStore'
import type { AvatarAppearance } from '../store/avatarStore'

export function AvatarCustomizer() {
  const { appearance, updateAppearance } = useAvatarStore()

  const handleSliderChange = (key: keyof AvatarAppearance, value: string | number) => {
    updateAppearance({ [key]: value })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5" />
        아바타 외형 커스터마이징
      </h3>

      <div className="space-y-6">
        {/* 기본 설정 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            기본 설정
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                성별
              </label>
              <select
                value={appearance.gender}
                onChange={(e) => handleSliderChange('gender', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="female">여성</option>
                <option value="male">남성</option>
                <option value="non-binary">논바이너리</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                피부톤
              </label>
              <select
                value={appearance.skinTone}
                onChange={(e) => handleSliderChange('skinTone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="light">밝은 톤</option>
                <option value="medium">중간 톤</option>
                <option value="tan">태닝 톤</option>
                <option value="dark">어두운 톤</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              키 ({appearance.height}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={appearance.height}
              onChange={(e) => handleSliderChange('height', parseInt(e.target.value))}
              className="slider w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>작음</span>
              <span>보통</span>
              <span>큼</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              체형
            </label>
            <select
              value={appearance.bodyType}
              onChange={(e) => handleSliderChange('bodyType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="slim">슬림</option>
              <option value="average">보통</option>
              <option value="athletic">운동선수형</option>
              <option value="curvy">곡선형</option>
            </select>
          </div>
        </div>

        {/* 얼굴 설정 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            얼굴 & 헤어
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                얼굴형
              </label>
              <select
                value={appearance.facialStyle}
                onChange={(e) => handleSliderChange('facialStyle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="soft">부드러운</option>
                <option value="sharp">날카로운</option>
                <option value="round">둥근</option>
                <option value="angular">각진</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                헤어스타일
              </label>
              <select
                value={appearance.hairStyle}
                onChange={(e) => handleSliderChange('hairStyle', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="short">짧은 머리</option>
                <option value="medium">중간 길이</option>
                <option value="long">긴 머리</option>
                <option value="curly">곱슬머리</option>
                <option value="straight">직모</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              머리 색상
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { value: 'black', label: '검정', color: 'bg-black' },
                { value: 'brown', label: '갈색', color: 'bg-amber-800' },
                { value: 'blonde', label: '금발', color: 'bg-yellow-300' },
                { value: 'red', label: '빨강', color: 'bg-red-500' },
                { value: 'blue', label: '파랑', color: 'bg-blue-500' },
                { value: 'pink', label: '분홍', color: 'bg-pink-400' }
              ].map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSliderChange('hairColor', color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    appearance.hairColor === color.value
                      ? 'border-primary-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto ${color.color}`}></div>
                  <span className="text-xs mt-1 block">{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 의상 설정 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Shirt className="w-4 h-4" />
            의상 스타일
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              옷 스타일
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { value: 'casual', label: '캐주얼', emoji: '👕' },
                { value: 'formal', label: '정장', emoji: '👔' },
                { value: 'sporty', label: '스포티', emoji: '🏃' },
                { value: 'trendy', label: '트렌디', emoji: '✨' },
                { value: 'vintage', label: '빈티지', emoji: '🕰️' }
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleSliderChange('outfitStyle', style.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    appearance.outfitStyle === style.value
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.emoji}</div>
                  <span className="text-sm font-medium">{style.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
