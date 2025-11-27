# Sangsunghyung AI Halyong S-Team Project
## 📱 AI Friend Chat - 나만의 AI 친구 생성 및 대화 앱

Google Gemini API를 활용하여 나만의 가상 친구(AI 페르소나)를 생성하고, 음성과 텍스트로 대화할 수 있는 React Native 모바일 애플리케이션입니다.

## 🎯 프로젝트 개요

사용자가 텍스트 또는 이미지로 자신만의 AI 친구를 생성하고, 생성된 캐릭터와 실시간으로 교감할 수 있습니다.
캐릭터는 사용자의 대화에 따라 감정을 표현하며, 시각적(이미지) 및 청각적(음성) 경험을 제공합니다.

### ⭐ 주요 기능
- **🎨 AI 캐릭터 생성**: 텍스트 프롬프트 또는 사진 업로드를 통해 나만의 AI 친구 생성 (Google Imagen 3)
- **💬 실시간 대화**: AI 친구와 자연스러운 대화 (Google Gemini 1.5 Flash)
- **🗣️ 음성 대화 (TTS)**: AI 친구의 목소리 듣기 (예정)
- **👗 커스터마이징**: 헤어, 의상, 배경 등 스타일 변경
- **📱 몰입형 UI**: 캐릭터가 배경이 되는 전체 화면 대화 인터페이스

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | React Native (Expo SDK 51) |
| **Language** | TypeScript |
| **Styling** | NativeWind (Tailwind CSS) |
| **State Management** | Zustand |
| **Navigation** | React Navigation (Bottom Tabs) |
| **AI Model** | Google Gemini API (Imagen 3, Gemini 1.5 Pro) |
| **UI Components** | Expo Image, Linear Gradient, Vector Icons |

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── AvatarPreview.tsx     # 캐릭터 생성 및 미리보기
│   ├── CustomizerPanel.tsx   # 스타일 변경 패널
│   └── ChatBubble.tsx        # 대화 말풍선 컴포넌트
├── screens/
│   ├── HomeScreen.tsx        # 홈 (캐릭터 생성)
│   ├── ChatScreen.tsx        # 대화 (AI 채팅)
│   └── MyScreen.tsx          # 마이페이지 (설정 및 저장)
├── services/
│   └── gemini.ts             # Google Gemini API 연동 (Image & Chat)
├── store/
│   ├── avatarStore.ts        # 캐릭터 상태 관리
│   └── chatStore.ts          # 대화 내역 관리
└── navigation/
    └── BottomTabs.tsx        # 하단 탭 네비게이션
```

## 🚀 시작하기

### 1. 설치
```bash
npm install
```

### 2. API 키 설정
`src/services/gemini.ts` 파일에서 `GEMINI_API_KEY`를 설정해야 합니다.

### 3. 실행
```bash
npm start
```
- **i**: iOS 시뮬레이터 실행
- **a**: Android 에뮬레이터 실행
- **w**: 웹 브라우저 실행

## 📝 개발 진행 상황

- [x] **초기 설정**: Expo + NativeWind + TypeScript 환경 구축
- [x] **UI 구현**: 홈, 대화, 마이페이지 다크 테마 디자인 적용
- [x] **AI 연동**: Google Gemini API (이미지 생성, 텍스트 대화) 연결 완료
- [x] **상태 관리**: Zustand를 이용한 전역 상태 관리 구현
- [ ] **음성 합성(TTS)**: 대화 음성 출력 기능 (구현 예정)
- [ ] **배포**: 앱 스토어 배포 준비

---

**S Team 노션 링크**: https://www.notion.so/k52524/S-Team-257a50f07615815c8210fb082ae02cd5
