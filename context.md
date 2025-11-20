# 📱 React Native 기반 2D 아바타 커스터마이징 + 반응형 대화 앱 기획서

본 문서는 **React Native 버전으로 재구성된 전체 구조/기능 명세**입니다.  
UI는 **블랙 테마**, 3개의 탭으로 구성된 네비게이션 구조를 사용합니다.

---

## 🧩 1. 기술 스택

| 목적 | 기술 |
|------|------|
| Framework | **React Native (Expo 권장)** |
| UI | **Tailwind RN (nativewind)** |
| Navigation | **React Navigation (Bottom Tabs)** |
| 상태관리 | **Zustand** |
| 저장소 | **AsyncStorage** |
| AI | Google **NanoBanana Image / Text / TTS** |
| 애니메이션 | Reanimated, Lottie, Canvas(PixiRN) |

---

## 🧩 2. 앱 구조 (3개의 탭)

### **BottomTab 구조**
- **홈(Home)**  
  캐릭터 생성/커스터마이징/상점

- **대화(Chat)**  
  감정·표정 연동 실시간 채팅 + TTS 음성

- **마이(My)**  
  아바타 저장, 공유, 이벤트·퀘스트, 설정

---

## 🧩 3. 핵심 기능

### ⭐ 1) 캐릭터 · 배경 커스터마이징
- 얼굴, 헤어, 의상, 악세서리, 배경까지 조합형식
- 실시간 Canvas 미리보기
- 파츠 변경 시 즉각 반영
- 무료/유료 아이템 제공  
  → 상점 기능 포함

---

### ⭐ 2) 실시간 반응형 채팅
- 입력한 텍스트 → **NanoBanana Text API**
- 감정(기쁨/분노/놀람/슬픔/중립) 분석
- 감정 → 표정/모션 자동 매핑
- 말풍선 표시 + 애니메이션
- `/ 명령어` 사용 시 특정 모션 재생  
  - `/jump`  
  - `/smile`  
  - `/angry` 등

---

### ⭐ 3) TTS 기반 음성 출력
- 텍스트 입력 → 캐릭터 실제 음성으로 재생
- 음성 감정 톤 반영  
  (밝음, 차분함, 화남 등)
- 음성 재생 중 입모양 lip-sync 처리

---

### ⭐ 4) 커스터마이징 상점
- 무료/유료 아이템
- 이벤트/퀘스트로 받은 포인트로 구매 가능
- 향후 인앱결제 연결 가능 구조

---

### ⭐ 5) 아바타 저장 & 공유
- Canvas를 PNG로 저장
- 짧은 애니메이션을 영상으로 저장  
  (lottie/캔버스 기반)
- SNS 공유 기능

---

### ⭐ 6) 퀘스트 / 이벤트 시스템
- 데일리 미션, 주간 이벤트 제공
- 포인트 및 아이템 보상
- 캐릭터 성장형 요소 추가 가능

---

## 🗂 4. 폴더 구조 (React Native 기준)
/src
├─ screens/
│ ├─ HomeScreen.tsx
│ ├─ ChatScreen.tsx
│ └─ MyScreen.tsx
│
├─ components/
│ ├─ AvatarPreview.tsx
│ ├─ CustomizerPanel.tsx
│ ├─ PersonalityPanel.tsx
│ ├─ ChatBubble.tsx
│ ├─ EmotionAvatar.tsx
│ ├─ CommandEmoteButtons.tsx
│ └─ TTSPlayer.tsx
│
├─ store/
│ ├─ avatarStore.ts
│ ├─ chatStore.ts
│ └─ itemStore.ts
│
├─ hooks/
│ ├─ useAvatarGenerator.ts
│ ├─ usePersonalityChat.ts
│ ├─ useEmotionMapper.ts
│ └─ useTTS.ts
│
├─ utils/
│ ├─ promptBuilder.ts
│ └─ emotionRules.ts
│
├─ navigation/
│ └─ BottomTabs.tsx
│
└─ App.tsx

---

## 🧪 5. 사실적인 동작 흐름

### **1) 유저가 커스터마이징 화면에서 옵션 선택**
→ Zustand avatarStore 업데이트  
→ AvatarPreview가 Canvas에 즉시 반영  
→ 변경된 파츠를 기반으로 promptBuilder 생성

---

### **2) 최종 캐릭터 생성**
→ useAvatarGenerator에서 NanoBanana Image API 호출  
→ 이미지 반환 후 캐릭터로 렌더링

---

### **3) 채팅 화면에서 메시지 입력**
→ personality context와 함께 NanoBanana Text API 호출  
→ 감정 분석 후 emotionRules 매핑  
→ 표정/모션 변경  
→ 말풍선 + 애니메이션 표시

→ **동시에 TTS 실행**  
→ lip-sync 모션 연동

---

### **4) 명령어 입력 시**
예: `/jump`  
→ EmotionAvatar에서 해당 모션 트리거  
→ 애니메이션 재생

---

### **5) 저장 & 공유**
→ Canvas snapshot → PNG  
→ MediaLibrary 저장  
→ SNS 공유

---

## ✔️ 다음 단계 선택

원하는 다음 작업을 선택하세요:

1. **초기 React Native 프로젝트 + Tailwind + Zustand + TabBar 셋업 코드 전체 생성**  
2. **각 화면(Home/Chat/My) 레이아웃 기본 UI 작성**  
3. **Zustand store 전체 기본구조 작성**  
4. **NanoBanana API 연동 템플릿 생성**  
5. **Canvas 기반 아바타 미리보기 기본 코드 생성**

