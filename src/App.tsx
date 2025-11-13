import React, { useState } from 'react'
import { Sparkles, Settings, MessageSquare, Image, Wand2 } from 'lucide-react'
import { AvatarCanvas } from './components/AvatarCanvas'
import { AvatarCustomizer } from './components/AvatarCustomizer'
import { PersonalityEditor } from './components/PersonalityEditor'
import { ChatWindow } from './components/ChatWindow'
import { ImageUploader } from './components/ImageUploader'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useAvatarStore } from './store/avatarStore'
import { buildAvatarPrompt } from './utils/promptBuilder'

type TabType = 'customize' | 'personality' | 'chat'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('customize')
  const { 
    appearance, 
    personality, 
    referenceImage,
    isGeneratingAvatar,
    setGeneratingAvatar,
    setAvatarImageUrl,
    resetAvatar
  } = useAvatarStore()

  // 아바타 생성 핸들러 (더미 - 실제로는 NanoBanana API 호출)
  const handleGenerateAvatar = async () => {
    setGeneratingAvatar(true)
    
    try {
      // 프롬프트 생성
      const prompt = buildAvatarPrompt(appearance, personality, referenceImage || undefined)
      console.log('Generated prompt:', prompt)
      
      // TODO: 실제 NanoBanana Image API 호출
      // 현재는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 더미 이미지 URL (실제로는 API 응답에서 받아올 예정)
      const dummyImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      setAvatarImageUrl(dummyImageUrl)
      
    } catch (error) {
      console.error('아바타 생성 오류:', error)
      alert('아바타 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setGeneratingAvatar(false)
    }
  }

  const tabs = [
    {
      id: 'customize' as TabType,
      label: '외형 설정',
      icon: Settings,
      description: '아바타의 외형을 커스터마이징하세요'
    },
    {
      id: 'personality' as TabType,
      label: '성격 설정',
      icon: Sparkles,
      description: '아바타의 성격과 말투를 설정하세요'
    },
    {
      id: 'chat' as TabType,
      label: '채팅',
      icon: MessageSquare,
      description: '아바타와 대화를 나눠보세요'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Avatar Chat</h1>
                <p className="text-sm text-gray-600">2D 아바타 커스터마이징 & 개성 채팅</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={resetAvatar}
                className="btn-secondary text-sm"
              >
                초기화
              </button>
              <button
                onClick={handleGenerateAvatar}
                disabled={isGeneratingAvatar}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingAvatar ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    아바타 생성
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 아바타 미리보기 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <AvatarCanvas />
              <ImageUploader />
            </div>
          </div>

          {/* 오른쪽: 설정 패널 */}
          <div className="lg:col-span-2">
            {/* 탭 네비게이션 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 mb-6">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-center transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">{tab.label}</div>
                    </button>
                  )
                })}
              </div>
              
              {/* 탭 설명 */}
              <div className="px-6 py-3 bg-gray-50/50">
                <p className="text-sm text-gray-600">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="animate-fade-in">
              {activeTab === 'customize' && <AvatarCustomizer />}
              {activeTab === 'personality' && <PersonalityEditor />}
              {activeTab === 'chat' && (
                <div className="h-[600px]">
                  <ChatWindow />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600">
            <Image className="w-4 h-4" />
            <span>Google NanoBanana API 기반 AI 아바타 생성</span>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-16 py-8 bg-white/50 backdrop-blur-sm border-t border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>© 2024 AI Avatar Chat - 생성형 AI 활용 프로젝트</p>
          <p className="mt-1">React + TypeScript + Tailwind CSS + Zustand</p>
        </div>
      </footer>
    </div>
  )
}

export default App
