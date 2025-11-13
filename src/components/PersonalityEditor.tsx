import React from 'react'
import { Brain, Heart, Zap, Smile, Users, Star } from 'lucide-react'
import { useAvatarStore } from '../store/avatarStore'
import type { PersonalityTraits } from '../store/avatarStore'

export function PersonalityEditor() {
  const { personality, updatePersonality } = useAvatarStore()

  const handleTraitChange = (trait: keyof PersonalityTraits, value: number) => {
    updatePersonality({ [trait]: value })
  }

  const personalityTraits = [
    {
      key: 'energy' as keyof PersonalityTraits,
      label: '에너지',
      icon: Zap,
      description: '차분함 vs 활발함',
      leftLabel: '차분한',
      rightLabel: '활발한',
      color: 'text-yellow-500'
    },
    {
      key: 'sociability' as keyof PersonalityTraits,
      label: '사교성',
      icon: Users,
      description: '내향적 vs 외향적',
      leftLabel: '내향적',
      rightLabel: '외향적',
      color: 'text-blue-500'
    },
    {
      key: 'creativity' as keyof PersonalityTraits,
      label: '창의성',
      icon: Brain,
      description: '논리적 vs 창의적',
      leftLabel: '논리적',
      rightLabel: '창의적',
      color: 'text-purple-500'
    },
    {
      key: 'humor' as keyof PersonalityTraits,
      label: '유머감각',
      icon: Smile,
      description: '진지함 vs 유쾌함',
      leftLabel: '진지한',
      rightLabel: '유쾌한',
      color: 'text-green-500'
    },
    {
      key: 'empathy' as keyof PersonalityTraits,
      label: '공감능력',
      icon: Heart,
      description: '분석적 vs 감정적',
      leftLabel: '분석적',
      rightLabel: '감정적',
      color: 'text-red-500'
    },
    {
      key: 'confidence' as keyof PersonalityTraits,
      label: '자신감',
      icon: Star,
      description: '겸손함 vs 자신감',
      leftLabel: '겸손한',
      rightLabel: '자신있는',
      color: 'text-orange-500'
    }
  ]

  const getPersonalityDescription = () => {
    const traits = []
    
    if (personality.energy >= 7) traits.push('활발하고')
    else if (personality.energy <= 3) traits.push('차분하고')
    
    if (personality.sociability >= 7) traits.push('외향적이며')
    else if (personality.sociability <= 3) traits.push('내향적이며')
    
    if (personality.creativity >= 7) traits.push('창의적이고')
    else if (personality.creativity <= 3) traits.push('논리적이고')
    
    if (personality.humor >= 7) traits.push('유쾌한')
    else if (personality.humor <= 3) traits.push('진지한')
    
    if (personality.empathy >= 7) traits.push('감정적인')
    else if (personality.empathy <= 3) traits.push('분석적인')
    
    if (personality.confidence >= 7) traits.push('자신감 있는')
    else if (personality.confidence <= 3) traits.push('겸손한')
    
    return traits.length > 0 ? `${traits.join(' ')} 성격` : '균형잡힌 성격'
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        아바타 성격 설정
      </h3>

      {/* 성격 요약 */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-gray-700 mb-2">현재 성격 프로필</h4>
        <p className="text-gray-600">{getPersonalityDescription()}</p>
      </div>

      <div className="space-y-6">
        {personalityTraits.map((trait) => {
          const Icon = trait.icon
          const value = personality[trait.key]
          
          return (
            <div key={trait.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${trait.color}`} />
                  <span className="font-medium text-gray-700">{trait.label}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {value}/10
                </span>
              </div>
              
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value}
                  onChange={(e) => handleTraitChange(trait.key, parseInt(e.target.value))}
                  className="slider w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{trait.leftLabel}</span>
                  <span className="text-gray-400">{trait.description}</span>
                  <span>{trait.rightLabel}</span>
                </div>
              </div>
              
              {/* 시각적 표시 */}
              <div className="flex space-x-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm transition-all duration-200 ${
                      i < value
                        ? `bg-gradient-to-r from-primary-400 to-primary-500`
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 성격 프리셋 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-4">빠른 성격 프리셋</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              name: '활발한 친구',
              traits: { energy: 8, sociability: 8, creativity: 6, humor: 7, empathy: 7, confidence: 7 },
              emoji: '🌟'
            },
            {
              name: '차분한 현자',
              traits: { energy: 3, sociability: 4, creativity: 7, humor: 4, empathy: 8, confidence: 6 },
              emoji: '🧘'
            },
            {
              name: '유쾌한 개그맨',
              traits: { energy: 7, sociability: 9, creativity: 8, humor: 9, empathy: 6, confidence: 8 },
              emoji: '😄'
            },
            {
              name: '논리적 분석가',
              traits: { energy: 5, sociability: 4, creativity: 3, humor: 3, empathy: 4, confidence: 7 },
              emoji: '🤓'
            }
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => updatePersonality(preset.traits)}
              className="p-3 text-center border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <div className="text-2xl mb-1">{preset.emoji}</div>
              <div className="text-sm font-medium text-gray-700">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
