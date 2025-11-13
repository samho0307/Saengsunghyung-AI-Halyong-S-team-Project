```text
You are an expert AI engineer working in Cursor.
You are building a **2D AI Avatar Customization + Personality Chat Project** using **React, TypeScript, and Tailwind CSS**.
All AI image generation and personality logic will use **Google NanoBanana API (Vertex AI Image + Language)**.
No external backend or database — everything runs client-side.

---

### 🔹 Project Objective
Create a web app that allows users to:
1. Upload a photo (optional)
2. Generate a 2D stylized avatar using **NanoBanana Image Generation API**
3. Customize avatar features:
   - Height, body type, gender, skin tone, outfit, facial style
   - **Personality traits** (e.g., calm / energetic / playful / shy / logical)
4. Start chatting with the avatar, where:
   - The avatar’s dialogue tone, expression, and motion depend on its **personality profile**
   - The avatar visually reacts (facial expressions, simple motions)
5. Allow users to re-edit avatar appearance or personality anytime.

---

### 🔹 Tech Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand (avatar + chat + personality states)
- **AI Integration:**
  - `NanoBanana Image API` → avatar generation from prompt + image
  - `NanoBanana Text API` → avatar’s dialogue generation based on personality
- **Animation / Rendering:** Canvas or PixiJS for 2D motion and facial expression control
- **No backend / DB** — use LocalStorage for temporary data.

---

### 🔹 Folder Structure
```

/src
├─ components/
│   ├─ AvatarCanvas.tsx        // Renders avatar + expressions
│   ├─ AvatarCustomizer.tsx    // UI sliders for body & appearance
│   ├─ PersonalityEditor.tsx   // Personality sliders / toggles
│   ├─ ChatWindow.tsx          // Real-time chat with avatar
│   ├─ ImageUploader.tsx       // Upload and preview photo
│   └─ LoadingSpinner.tsx
├─ hooks/
│   ├─ useAvatarGenerator.ts   // Calls NanoBanana Image API
│   ├─ usePersonalityChat.ts   // Calls NanoBanana Text API with personality context
│   └─ useEmotionMapper.ts     // Maps chat emotion → avatar expression
├─ store/
│   └─ avatarStore.ts          // Zustand state for customization & personality
├─ utils/
│   └─ promptBuilder.ts        // Builds dynamic prompt text from user params
├─ App.tsx
├─ main.tsx
└─ index.css

```

---

### 🔹 Avatar Generation Prompt Template
Used by `useAvatarGenerator.ts`:

```

"Create a 2D anime-style avatar with ${skinTone} skin, ${bodyType} body, ${gender}, wearing ${outfitStyle}.
The avatar’s expression should reflect a ${personalityTrait} personality.
Style: clean line art, soft color palette, subtle lighting."

```

---

### 🔹 Personality-driven Chat Logic
In `usePersonalityChat.ts`:

- When user sends a message, prepend system prompt:
```

The avatar has a ${personalityTrait} personality.
It should respond in a tone consistent with that trait — for example:

* Calm: gentle, thoughtful
* Energetic: short, vivid, expressive
* Playful: humorous, teasing
* Shy: short, hesitant
* Logical: analytical, precise

```

- Send both user message and avatar personality context to NanoBanana Text API.
- Map sentiment/emotion of response → expression ID for animation.

---

### 🔹 Visual Interaction
- When the avatar replies, `useEmotionMapper` analyzes message tone to update:
- Mouth shape (talking / idle)
- Eye / eyebrow / head tilt motion
- Micro-motions via PixiJS filters

---

### 🔹 Implementation Sequence
1. Scaffold components and Zustand stores.
2. Integrate NanoBanana Image API → avatar generation from prompt.
3. Add sliders/toggles for physical + personality traits.
4. Connect NanoBanana Text API → chat responses.
5. Link emotion mapping to facial animation.

---

### 🔹 Special Rules
- Use async/await for all API calls.
- Cache last generated avatar to avoid unnecessary API calls.
- Keep UI minimal, futuristic, and responsive.
- Output clean, production-grade React code.
- When unsure about motion rendering, prefer simple CSS transitions or PixiJS filters.

---

Your first task:
> Create initial project structure with Tailwind and Zustand setup, and dummy layout for AvatarCustomizer.tsx, PersonalityEditor.tsx, and ChatWindow.tsx components.
```

---
