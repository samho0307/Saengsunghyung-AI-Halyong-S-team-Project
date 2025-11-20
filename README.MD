AI Avatar Chat - 2D 아바타 커스터마이징 & 개성 채팅
생성형 AI 활용 조별과제 - React + TypeScript + Tailwind CSS + Zustand

🎯 프로젝트 개요
사용자가 2D 아바타를 커스터마이징하고, 설정한 성격 특성에 따라 아바타와 채팅할 수 있는 웹 애플리케이션입니다.

주요 기능
📸 참조 이미지 업로드 (선택사항)
🎨 2D 아바타 생성 (Google NanoBanana Image API 사용 예정)
⚙️ 외형 커스터마이징: 피부톤, 체형, 성별, 키, 의상, 얼굴형, 헤어스타일 등
🧠 성격 설정: 에너지, 사교성, 창의성, 유머감각, 공감능력, 자신감 조절
💬 개성 채팅: 설정된 성격에 따른 아바타와의 실시간 대화
😊 감정 표현: 대화 내용에 따른 아바타 표정 및 감정 변화
🛠 기술 스택
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS
State Management: Zustand
AI Integration: Google NanoBanana API (Vertex AI Image + Language)
Animation: PixiJS (예정)
Storage: LocalStorage (임시 데이터)
📁 프로젝트 구조
src/
├── components/
│   ├── AvatarCanvas.tsx        # 아바타 렌더링 및 표정 표시
│   ├── AvatarCustomizer.tsx    # 외형 커스터마이징 UI
│   ├── PersonalityEditor.tsx   # 성격 특성 설정 UI
│   ├── ChatWindow.tsx          # 채팅 인터페이스
│   ├── ImageUploader.tsx       # 참조 이미지 업로드
│   └── LoadingSpinner.tsx      # 로딩 컴포넌트
├── hooks/
│   ├── useAvatarGenerator.ts   # 아바타 생성 API 호출
│   ├── usePersonalityChat.ts   # 성격 기반 채팅 API
│   └── useEmotionMapper.ts     # 감정 분석 및 표정 매핑
├── store/
│   └── avatarStore.ts          # Zustand 상태 관리
├── utils/
│   └── promptBuilder.ts        # AI 프롬프트 생성 유틸리티
├── App.tsx                     # 메인 애플리케이션
└── main.tsx                    # 엔트리 포인트
🚀 시작하기
1. 의존성 설치
npm install
2. 개발 서버 실행
npm run dev
3. 빌드
npm run build
🎨 주요 컴포넌트
AvatarCustomizer
아바타 외형 설정 (피부톤, 체형, 성별, 키, 의상 등)
실시간 미리보기
색상 선택 및 스타일 옵션
PersonalityEditor
6가지 성격 특성 조절 (1-10 스케일)
성격 프리셋 제공
실시간 성격 프로필 표시
ChatWindow
실시간 채팅 인터페이스
성격 기반 아바타 응답
감정 표현 및 애니메이션
채팅 기록 관리
AvatarCanvas
2D 아바타 렌더링
감정 표현 및 애니메이션
실시간 상태 표시
🔮 향후 개발 계획
NanoBanana API 연동: 실제 AI 이미지 생성 및 텍스트 생성
PixiJS 애니메이션: 고급 2D 애니메이션 및 표정 변화
음성 합성: 아바타 음성 출력 기능
소셜 기능: 아바타 공유 및 커뮤니티
모바일 최적화: 반응형 디자인 개선
📝 개발 노트
현재 버전은 더미 데이터와 시뮬레이션을 사용하여 UI/UX를 구현했습니다. 실제 AI API 연동은 다음 단계에서 진행될 예정입니다.