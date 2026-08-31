# 🧠 Brahmi AI

**Helping Dementia Patients Stay Connected with Their Memories**

A cognitive assistance platform designed for elderly dementia patients in the North Eastern Region of India. Instead of generic memory exercises, Brahmi AI creates personalized cognitive activities using the patient's own family photos, familiar objects, memories, and daily routine.

---

## 🌟 Features

### 🎮 Cognitive Games
- **Memory Album** — Identify family photos with adaptive difficulty
- **Memory Tray** — Remember and recall familiar objects
- **Family Face Match** — Match family members from photos
- **Daily Routine Sequencer** — Arrange daily activities in order
- **Spot the Difference** — Find what changed between two images
- **Pair Matcher** — Match related memory pairs

### 🤖 Sakshi AI Assistant
- Conversational AI that speaks the patient's preferred language
- Real-time speech recognition and text-to-speech
- Proactive health monitoring when connected to smartwatch
- Emergency detection and automatic caregiver notification
- Handles 11 languages including Hindi, Assamese, Bengali, and more

### ⌚ Smartwatch Integration
- Real-time heart rate monitoring via Bluetooth (Web Bluetooth API)
- Step counting, calories, sleep tracking, and activity monitoring
- Automatic emergency alerts when critical health parameters detected
- Floating health widget with live BPM display

### 📱 Multilingual Support
11 languages including:
- English, Hindi, Assamese, Bengali, Manipuri (Meitei), Mizo, Khasi, Garo, Nepali, Bodo, Kokborok

### 🚨 Emergency SMS
- Automatic SMS delivery to emergency contact via Twilio
- Triggered by patient button press or Sakshi AI detection
- Works through cellular network — no internet needed on receiver's end

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React + Vite | Frontend framework and build tool |
| Tailwind CSS | Styling and responsive design |
| React Router DOM | Client-side routing |
| Framer Motion | Animations and transitions |
| Lucide React | Icon library |
| Web Bluetooth API | Smartwatch connectivity |
| Web Speech API | Voice recognition and text-to-speech |
| Twilio API | SMS delivery |
| i18n | Internationalization (11 languages) |

---

## 📁 Project Structure

```
brahmi-ai/
├── public/
├── api/
│   └── send-emergency-sms.js      # Vercel serverless function for SMS
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── sakshi/
│   │   │   └── SakshiAssistant.jsx # AI conversational assistant
│   │   ├── smartwatch/
│   │   │   ├── SmartwatchFloating.jsx
│   │   │   └── SmartwatchPanel.jsx
│   │   └── ui/
│   │       ├── BrahmiLogo.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── LanguageSelector.jsx
│   │       └── Select.jsx
│   ├── context/
│   │   ├── DataContext.jsx          # Patient data, schedule, memories
│   │   └── SmartwatchContext.jsx    # Health data and BLE connection
│   ├── hooks/
│   │   └── useScheduleReminder.js
│   ├── i18n/
│   │   ├── LanguageContext.jsx      # Language provider
│   │   └── locales/                # Translation files
│   │       ├── en.json
│   │       ├── hi.json
│   │       ├── as.json
│   │       ├── bn.json
│   │       ├── ne.json
│   │       ├── mni.json
│   │       ├── mz.json
│   │       ├── kha.json
│   │       ├── gar.json
│   │       ├── brx.json
│   │       └── kok.json
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── caregiver/
│   │   │   ├── CaregiverDashboard.jsx
│   │   │   ├── SetupPage.jsx
│   │   │   └── steps/
│   │   │       ├── CaregiverInfoStep.jsx
│   │   │       ├── PatientInfoStep.jsx
│   │   │       ├── EmergencyContactStep.jsx
│   │   │       ├── DailyScheduleStep.jsx
│   │   │       ├── MemoryVaultStep.jsx
│   │   │       └── ReviewStep.jsx
│   │   ├── patient/
│   │   │   └── PatientDashboard.jsx
│   │   └── games/
│   │       ├── GameDashboard.jsx
│   │       ├── MemoryAlbum.jsx
│   │       ├── MemoryTray.jsx
│   │       ├── FaceMatch.jsx
│   │       ├── RoutineSequencer.jsx
│   │       ├── WhatChanged.jsx
│   │       └── PairMatcher.jsx
│   ├── utils/
│   │   ├── emergencyService.js     # SMS delivery service
│   │   └── timezone.js             # IST timezone utilities
│   ├── App.jsx                     # Routes and providers
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/brahmi-ai.git
cd brahmi-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Twilio SMS (for emergency alerts)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npx vercel --prod
```

---

## 📱 Application Flow

```
Landing Page
    ↓
Select Role (Caregiver / Patient)
    ↓
Caregiver Setup (6 Steps)
├── 1. Caregiver Information
├── 2. Patient Information  
├── 3. Emergency Contact
├── 4. Daily Schedule
├── 5. Memory Vault
└── 6. Review & Activate
    ↓
Patient Dashboard
├── Greeting & Schedule
├── Fun Activities (Games)
├── Emergency SMS Button
├── Sakshi AI Assistant (Bottom-Right)
└── Smartwatch Health Monitor (Bottom-Left)
    ↓
Caregiver Dashboard
├── Patient Overview
├── Schedule Management
├── Health Monitoring
└── Activity History
```

---

## 🎯 Design Principles

- **Elderly-Friendly** — Large buttons, readable typography, minimal clutter
- **Premium UI** — Apple/Notion-inspired glassmorphism, soft shadows, smooth animations
- **Accessible** — High contrast, large touch targets, voice-first interaction
- **Offline-First** — Core features work without internet
- **Multilingual** — 11 languages with instant switching

---

## 🌐 Live Demo

🔗 [https://freebuff-three.vercel.app](https://freebuff-three.vercel.app)

---

## 📄 License

This project was built for **Smart India Hackathon (SIH)**.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For queries about this project, please open an issue on GitHub.
