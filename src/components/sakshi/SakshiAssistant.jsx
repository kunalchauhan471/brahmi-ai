import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, X, Mic, Send, MessageSquare, Volume2, VolumeX,
  Brain, AlertTriangle, Gamepad2, Heart
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useSmartwatch } from '../../context/SmartwatchContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { getISTHour, getISTTotalMinutes, parseTimeToMinutes } from '../../utils/timezone'
import BrahmiLogo from '../ui/BrahmiLogo'

const LANG_VOICE_MAP = {
  en: 'en', hi: 'hi', as: 'as', bn: 'bn', ne: 'ne', mni: 'hi',
  mz: 'en', kha: 'en', gar: 'en', brx: 'hi', kok: 'bn',
}

function speak(rawText, onEnd, lang = 'en', voiceType = 'female', speed = 'normal') {
  if (!('speechSynthesis' in window)) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  // Strip emojis, markdown bold, bullet points, and clean up for speech
  const text = rawText
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/\*\*/g, '')
    .replace(/^[•\-\d.]+\s*/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) { onEnd?.(); return }

  const langRegionMap = { en: 'en-US', hi: 'hi-IN', as: 'as-IN', bn: 'bn-IN', ne: 'ne-NP', mni: 'hi-IN', mz: 'en-US', kha: 'en-US', gar: 'en-US', brx: 'hi-IN', kok: 'bn-IN' }
  const targetLang = langRegionMap[lang] || 'en-US'
  const baseLang = targetLang.substring(0, 2)
  const voices = window.speechSynthesis.getVoices()
  const isFemale = voiceType === 'female'

  // Female voice keywords
  const femaleKeywords = ['female', 'woman', 'samantha', 'karen', 'zira', 'hazel', 'fiona', 'google']
  // Male voice keywords
  const maleKeywords = ['male', 'man', 'david', 'james', 'daniel', 'google uk english male', 'microsoft david']
  const voiceKeywords = isFemale ? femaleKeywords : maleKeywords

  // 1. Try to find a voice for the target language matching gender
  let selectedVoice = voices.find(
    v => v.lang.startsWith(baseLang) && voiceKeywords.some(kw => v.name.toLowerCase().includes(kw))
  )
  // 2. Try any voice for the target language
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith(baseLang))
  }
  // 3. Try any voice matching gender
  if (!selectedVoice) {
    selectedVoice = voices.find(v => voiceKeywords.some(kw => v.name.toLowerCase().includes(kw)))
  }
  // 4. Fall back to any voice
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.startsWith('en'))
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = speed === 'slow' ? 0.6 : 0.9
  utterance.pitch = voiceType === 'female' ? 1.1 : 0.85
  utterance.volume = 1
  utterance.lang = targetLang
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }
  utterance.onend = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}

function getGreetingText(t) {
  const hour = getISTHour()
  if (hour < 12) return t('patient.greeting.morning')
  if (hour < 17) return t('patient.greeting.afternoon')
  return t('patient.greeting.evening')
}

const EMERGENCY_KEYWORDS = [
  'call', 'help', 'emergency', 'need help', 'call someone',
  'call doctor', 'call family', 'sos', 'urgent', 'not feeling well',
  'sick', 'pain', 'accident', 'fallen', 'fall'
]

function detectEmergency(text) {
  const lower = text.toLowerCase()
  return EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword))
}

function getMoodResponses(t) {
  return {
    good: t('sakshi.mood.good'),
    fine: t('sakshi.mood.fine'),
    bad: t('sakshi.mood.bad'),
    default: t('sakshi.mood.default'),
  }
}

export default function SakshiAssistant({ triggerReminder }) {
  const navigate = useNavigate()
  const { patientData, schedule, memories, emergencyContact } = useData()
  const { healthData, connected: watchConnected, emergencyActive, setEmergencyActive, getHeartRateStatus } = useSmartwatch()
  const patientName = patientData.name || 'Patient'
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const recognitionRef = useRef(null)
  const langRef = useRef(language)
  const watchConnectedRef = useRef(watchConnected)
  const healthDataRef = useRef(healthData)

  // Keep refs in sync
  useEffect(() => {
    langRef.current = language
  }, [language])
  useEffect(() => {
    watchConnectedRef.current = watchConnected
  }, [watchConnected])
  useEffect(() => {
    healthDataRef.current = healthData
  }, [healthData])

  // Reset greeting when language changes so Sakshi re-greets in new language
  useEffect(() => {
    if (isOpen) {
      setGreeted(false)
      setMessages([])
    }
  }, [language])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [])

  // Handle scheduled reminders
  useEffect(() => {
    if (triggerReminder) {
      setIsOpen(true)
      const name = patientData.name || 'there'
      const messages = [
        t('sakshi.reminderMessages.0', { name, title: triggerReminder.title }),
        t('sakshi.reminderMessages.1', { name, title: triggerReminder.title, notes: triggerReminder.notes || '' }),
        t('sakshi.reminderMessages.2', { name, title: triggerReminder.title, notes: triggerReminder.notes || '' }),
        t('sakshi.reminderMessages.3', { name, title: triggerReminder.title, notes: triggerReminder.notes || '' }),
      ]
      const text = messages[Math.floor(Math.random() * messages.length)]
      addBotMessage(text, 300)
    }
  }, [triggerReminder])

  // Greet on first open
  useEffect(() => {
    if (isOpen && !greeted) {
      setGreeted(true)
      const name = patientData.name || 'friend'
      const greeting = getGreetingText(t)

      const introMessages = [
        {
          id: Date.now(),
          text: `${greeting}, ${name}! 🌸`,
          sender: 'sakshi',
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          text: t('sakshi.greeting'),
          sender: 'sakshi',
          timestamp: new Date(),
        },
      ]

      setMessages(introMessages)

      if (voiceEnabled) {
        speak(`${greeting}, ${name}! ${t('sakshi.greeting')}`, null, langRef.current, patientData.voice || 'female', patientData.speechSpeed || 'normal')
      }
    }
  }, [isOpen, greeted, patientData.name, voiceEnabled, language])

  // ── SMARTWATCH HEALTH MONITORING ──
  // Sakshi proactively speaks when she detects health changes
  const lastHealthMessageRef = useRef(0)
  useEffect(() => {
    if (!watchConnectedRef.current || !voiceEnabled) return

    const interval = setInterval(() => {
      const now = Date.now()
      // Don't spam messages — minimum 30 seconds between health messages
      if (now - lastHealthMessageRef.current < 30000) return

      const hr = healthData.heartRate
      const status = getHeartRateStatus(hr)
      const name = patientData.name || 'there'

      if (status.urgent && hr > 110) {
        lastHealthMessageRef.current = now
        addBotMessage(`I noticed your heart rate is a bit high at ${hr} BPM. Please sit down and relax for a few minutes. 🧘‍♂️`, 300)
      } else if (status.urgent && hr < 55) {
        lastHealthMessageRef.current = now
        addBotMessage(`Your heart rate seems low at ${hr} BPM. If you feel dizzy or unwell, please let me know immediately. 🆘`, 300)
      } else if (healthData.battery < 15) {
        lastHealthMessageRef.current = now
        addBotMessage(`Your watch battery is running low at ${healthData.battery}%. Please charge it soon so we can keep monitoring. ⌚`, 300)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [watchConnected, healthData.heartRate, healthData.battery, voiceEnabled, patientData.name, language])

  // Handle emergency from smartwatch — send SMS to caregiver
  useEffect(() => {
    if (emergencyActive) {
      if (isOpen) {
        addBotMessage("🚨 I'm detecting an emergency! Your heart rate is critically abnormal. I'm sending an SMS to your emergency contact right now. Please stay calm.", 200)
      }
      // Send emergency notification to caregiver via SMS
      import('../../utils/emergencyService.js').then(({ sendEmergencySMS, isValidPhone }) => {
        const phone = emergencyContact?.phone
        if (phone && isValidPhone(phone)) {
          sendEmergencySMS(phone, patientName, `Smartwatch emergency detected — critically abnormal heart rate`)
            .then(r => {
              if (r.success && isOpen) {
                setTimeout(() => addBotMessage(`✅ Emergency SMS sent to ${emergencyContact.name || 'your caregiver'}. Help is on the way!`, 500), 3000)
              }
            })
        }
      }).catch(() => {})
    }
  }, [emergencyActive])

  // Speech Recognition setup
  const getRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null
    if (recognitionRef.current) return recognitionRef.current
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    const langMap = { en: 'en-US', hi: 'hi-IN', as: 'as-IN', bn: 'bn-IN', mni: 'mni-IN', ne: 'ne-NP' }
    recognition.lang = langMap[language] || 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }
      if (interim) setInterimText(interim)
      if (final) {
        setInterimText('')
        setInputText(final)
        handleUserMessage(final)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognition.onerror = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognitionRef.current = recognition
    return recognition
  }

  const startListening = () => {
    const recognition = getRecognition()
    if (!recognition) {
      addBotMessage("Sorry, voice recognition is not supported in your browser. You can type to me instead! 😊", 300)
      return
    }
    window.speechSynthesis?.cancel()
    setIsListening(true)
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        sender: 'sakshi',
        timestamp: new Date(),
      }])
      if (voiceEnabled) speak(text, null, langRef.current, patientData.voice || 'female', patientData.speechSpeed || 'normal')
    }, delay)
  }

  const handleUserMessage = (text) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    }])
    setInputText('')

    const lower = text.toLowerCase().trim()
    const name = patientData.name || 'there'

    // ── 1. EMERGENCY ──
    if (detectEmergency(text)) {
      setEmergencyMode(true)
      addBotMessage(t('sakshi.emergencyHelp'), 500)
      setTimeout(() => {
        addBotMessage(t('sakshi.emergencyCalling'), 1500)
      }, 100)
      // Send emergency notification to caregiver via SMS
      import('../../utils/emergencyService.js').then(({ sendEmergencySMS, isValidPhone }) => {
        const phone = emergencyContact?.phone
        if (phone && isValidPhone(phone)) {
          sendEmergencySMS(phone, patientName, 'Patient triggered emergency via Sakshi AI assistant')
            .then(r => {
              if (r.success) {
                setTimeout(() => {
                  addBotMessage(`✅ Emergency SMS sent to ${emergencyContact.name || 'your caregiver'}. Help is on the way!`, 500)
                }, 2000)
              } else {
                setTimeout(() => {
                  addBotMessage(`⚠️ Could not send SMS. Please call your caregiver directly.`, 500)
                }, 2000)
              }
            })
        } else {
          setTimeout(() => {
            addBotMessage(`⚠️ No emergency phone number set. Please ask your caregiver to add one.`, 500)
          }, 2000)
        }
      }).catch(() => {
        console.warn('[Sakshi] Could not load emergency service')
      })
      return
    }

    // ── 2. MOOD DETECTION ──
    const MOOD = getMoodResponses(t)
    if (lower.match(/\b(good|great|happy|wonderful|excellent|amazing|fantastic|awesome|nice|achha|badhiya|khush)\b/)) {
      const responses = MOOD.good
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      setTimeout(() => {
        const scheduleText = getScheduleSummary()
        addBotMessage(`Here's what you have planned today: ${scheduleText} Would you like to play some fun games? 🎮`, 1500)
      }, 200)
      return
    }
    if (lower.match(/\b(fine|okay|ok|alright|not bad|doing well|theek hai|sahi hai)\b/) && !lower.includes('schedule') && !lower.includes('time')) {
      const responses = MOOD.fine
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      setTimeout(() => {
        const scheduleText = getScheduleSummary()
        addBotMessage(`Let me tell you about today: ${scheduleText} You can also play memory games anytime! Just tap the game cards. 🧠`, 1500)
      }, 200)
      return
    }
    if (lower.match(/\b(bad|sad|tired|not good|sick|pain|hurts|unwell|weak|dizzy|headache|fever|cold|cough|bura|dukh|thak|dard|bimar)\b/)) {
      const responses = MOOD.bad
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      return
    }

    // ── 3. TIME & DATE ──
    if (lower.match(/\b(what time|current time|time now|kitne baje|time is it|samay)\b/)) {
      const now = new Date()
      const timeStr = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })
      addBotMessage(`It's ${timeStr} right now. ⏰\n\nHere's what's coming up next in your schedule: ${getScheduleSummary()}`)
      return
    }
    if (lower.match(/\b(what day|which day|date today|today date|aaj ki date|tarikh)\b/)) {
      const now = new Date()
      const dateStr = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      addBotMessage(`Today is ${dateStr}. 📅\n\n${getScheduleSummary()}`)
      return
    }
    if (lower.match(/\b(good morning|good afternoon|good evening)\b/)) {
      addBotMessage(`${getGreetingText(t)}, ${name}! 🌸\n\n${getScheduleSummary()}`)
      return
    }

    // ── 4. SPECIFIC SCHEDULE QUERIES ──
    // Next task / upcoming
    if (lower.match(/\b(next|upcoming|coming up|what's next|aage kya|next task|next activity|next reminder|agla|agle|pugun|pokkhol)\b/)) {
      const currentMinutes = getISTTotalMinutes()
      const nextItems = schedule
        .map(s => ({ ...s, mins: parseTimeToMinutes(s.time) }))
        .filter(s => s.mins !== null && s.mins > currentMinutes)
        .sort((a, b) => a.mins - b.mins)
      if (nextItems.length > 0) {
        const next = nextItems[0]
        const minsAway = next.mins - currentMinutes
        const hours = Math.floor(minsAway / 60)
        const mins = minsAway % 60
        let timeAway = ''
        if (hours > 0) timeAway += `${hours} hour${hours > 1 ? 's' : ''} `
        timeAway += `${mins} minute${mins !== 1 ? 's' : ''}`
        addBotMessage(`Your next task is **${next.title}** at ${next.time}. ⏰\nThat's about ${timeAway} from now.\n${next.notes ? `📝 ${next.notes}` : ''}`)
      } else {
        addBotMessage(`You've completed all your activities for today! Great job! 🎉`)
      }
      return
    }

    // Specific activity: medicine, lunch, breakfast, etc.
    const activityKeywords = ['medicine', 'medication', 'pill', 'dawa', 'goli', 'breakfast', 'nashta', 'lunch', 'dinner', 'meal', 'khana', 'walk', 'exercise', 'tea', 'chai', 'water', 'paani', 'sleep', 'sona', 'bedtime', 'nap']
    const matchedActivity = activityKeywords.find(kw => lower.includes(kw))
    if (matchedActivity && (lower.match(/\b(when|what time|kitne baje|time|schedule|remind|next|upcoming)\b/) || lower.includes(matchedActivity))) {
      const matched = schedule.filter(s => s.title.toLowerCase().includes(matchedActivity) || s.notes?.toLowerCase().includes(matchedActivity))
      if (matched.length > 0) {
        const items = matched.map(s => `• ${s.title} at ${s.time}${s.notes ? ` — ${s.notes}` : ''}`).join('\n')
        addBotMessage(`Here are your ${matchedActivity} reminders:\n\n${items} ⏰\n\nI'll remind you when it's time!`)
      } else {
        addBotMessage(`I don't see a specific ${matchedActivity} reminder in your schedule. Would you like me to check your full schedule? 📋`)
      }
      return
    }

    // General schedule query
    if (lower.match(/\b(schedule|today|plan|remind|what to do|aaj|routine|din|kaam|anusooca|shedyool)\b/)) {
      const scheduleText = getScheduleSummary()
      addBotMessage(`Here's your full schedule for today:\n\n${scheduleText}\n\nI'll remind you when it's time for each activity! ⏰`)
      return
    }

    // ── 4b. HEALTH & SMARTWATCH QUERIES ──
    if (lower.match(/\b(heart|heart rate|pulse|bpm|dil|dil ki dhadkan|heartbeats?|cardiac)\b/)) {
      if (watchConnectedRef.current) {
        const hr = healthDataRef.current.heartRate
        const status = getHeartRateStatus(hr)
        const wd = healthDataRef.current
        const friendlyMessage = hr >= 60 && hr <= 100
          ? `Your heart is doing well today! ❤️\n\nCurrent heart rate: **${hr} BPM**\nStatus: ${status.label}\n\nKeep staying active and hydrated!`
          : `I'm monitoring your heart rate. It's currently **${hr} BPM**, which is ${status.label.toLowerCase()}. ${hr > 100 ? 'Please rest for a moment.' : 'Please sit down if you feel any discomfort.'}`
        addBotMessage(friendlyMessage)
      } else {
        addBotMessage(`I can't check your heart rate right now because the smartwatch isn't connected. Would you like me to help you connect it? 📱`, 500)
      }
      return
    }
    if (lower.match(/\b(steps|walk|distance|kadam|how much did i walk|activity|exercise|calories?|cal)\b/)) {
      if (watchConnectedRef.current) {
        const wd = healthDataRef.current
        addBotMessage(`Here's your activity today:\n\n👣 Steps: **${wd.steps.toLocaleString()}**\n🔥 Calories: **${wd.calories} kcal**\n🚶 Activity: **${wd.activityMinutes} minutes**\n\n${wd.steps > 4000 ? "Great job staying active! 🎉" : "Try to take a short walk — it's good for you! 🚶"}`)
      } else {
        addBotMessage(`I can't track your steps right now because the smartwatch isn't connected. Connect it from the watch icon at the top! 📱`)
      }
      return
    }
    if (lower.match(/\b(sleep|slept|neend|rest|how did i sleep|sleep quality)\b/)) {
      if (watchConnectedRef.current) {
        const sleepH = healthDataRef.current.sleepHours
        addBotMessage(`You slept **${sleepH} hours** last night. 😴\n\n${sleepH >= 7 ? "That's a good amount of sleep! You should feel well-rested." : sleepH >= 5 ? "That's a bit less than recommended. Try to get 7-8 hours tonight." : "That's quite less. Make sure to rest early tonight."}`)
      } else {
        addBotMessage(`I can't check your sleep data right now. Connect your smartwatch to start tracking sleep! 😴`)
      }
      return
    }
    if (lower.match(/\b(watch|battery|smartwatch|wearable|band|gadget)\b/)) {
      if (watchConnectedRef.current) {
        const wd = healthDataRef.current
        addBotMessage(`Your ${wd.watchName} is connected! ⌚\n\n🔋 Battery: ${wd.battery}%\n📶 Signal: ${wd.signalStrength}%\n❤️ Heart Rate: ${wd.heartRate} BPM\n\nEverything looks good!`)
      } else {
        addBotMessage(`Your smartwatch isn't connected yet. Tap the watch icon at the top of the page to connect it and start health monitoring! ⌚`) 
      }
      return
    }

    // ── 5. FAMILY & MEMORY QUERIES ──
    // Check for specific person name
    const specificPerson = memories.find(m => lower.includes(m.name.toLowerCase()))
    if (specificPerson) {
      addBotMessage(`${specificPerson.emoji} **${specificPerson.name}** — ${specificPerson.relationship}\n\n${specificPerson.description}\n\nWould you like to know about anyone else? 📸`)
      return
    }

    // General family query
    if (lower.match(/\b(family|photo|memory|who is|talk|relative|son|daughter|wife|husband|log|parivar|rishte|yaad|paribar|poribar)\b/)) {
      if (memories.length > 0) {
        const familyList = memories.map(m => `${m.emoji} ${m.name} (${m.relationship})`).join('\n')
        addBotMessage(`Here are the people in your memory vault:\n\n${familyList}\n\nTell me a name and I'll share more details about them! 📸`)
      } else {
        addBotMessage(`No memories have been uploaded yet. Ask your caregiver to add family photos so we can connect with your loved ones! 📸`)
      }
      return
    }

    // ── 6. PATIENT INFO QUERIES ──
    if (lower.match(/\b(what's my name|my name|who am i|mera naam|naam kya|mung no|amar naam)\b/)) {
      addBotMessage(`Your name is **${patientData.name || 'not set yet'}**! 😊\n\n${patientData.age ? `You are ${patientData.age} years old.` : ''} ${patientData.gender || ''}`)
      return
    }
    if (lower.match(/\b(how old|my age|age|umar|kitne saal|kati barsha|bochor)\b/)) {
      addBotMessage(patientData.age ? `You are **${patientData.age} years old**! 😊\n\nAge is just a number — you're doing great!` : "I don't have your age on file yet. Your caregiver can add that information.")
      return
    }
    if (lower.match(/\b(what language|my language|language|hindi|english|bhasha)\b/)) {
      addBotMessage(patientData.language ? `Your preferred language is **${patientData.language}**. 🗣️` : "I don't have your language preference on file yet.")
      return
    }

    // ── 7. EMERGENCY CONTACT ──
    if (lower.match(/\b(emergency contact|emergency number|who to call|help number|sos number|ambulance)\b/)) {
      if (emergencyContact && emergencyContact.name) {
        addBotMessage(`Your emergency contact is:\n\n📞 **${emergencyContact.name}** (${emergencyContact.relationship || 'Emergency Contact'})\n📱 ${emergencyContact.phone || 'No number on file'}\n\nIn a real emergency, you can also dial **112** 🆘`)
      } else {
        addBotMessage(`I don't have an emergency contact on file. In a real emergency, please dial **112** 🆘\n\nAsk your caregiver to set up your emergency contact.`)
      }
      return
    }

    // ── 8. GAMES QUERIES ──
    const wantsGames = lower.match(/\b(game|play|bored|fun|khel|activity|activities|khelna|nakhla)\b/)
    const rejectsGames = lower.match(/\b(no|don|not want|skip|instead|nahi|mat|nah|mane nai|na|nai)\b/)
    if (wantsGames && !rejectsGames) {
      addBotMessage(`Yes! You can play games right below on this page! 🎮\n\nHere are the games you can play:\n• 🧠 Memory Album — Identify family photos\n• 🎯 Memory Tray — Remember objects\n• 👥 Face Match — Match family faces\n• 📋 Routine Sequencer — Order your day\n• 👁️ Spot the Difference — Find what changed\n• 💕 Pair Matcher — Match pairs\n\nScroll down and tap any game card to start!`, 500)
      return
    }

    // Affirmative responses
    if (lower.match(/\b(yes|sure|yeah|ok|let|take me|haan|theek hai|hoi)\b/) && !lower.includes('schedule')) {
      addBotMessage(`Great! Scroll down on this page and you'll see the Fun Activities cards — tap any game to start! 🎮`, 500)
      return
    }

    // ── 9. ABOUT SAKSHI ──
    if (lower.match(/\b(who are you|about you|what can you do|your name|tumhara naam|kya kar sakti)\b/)) {
      addBotMessage(`${t('sakshi.about')}\n\n${t('sakshi.helpWith')}\n\n${t('sakshi.helpSchedule')}\n${t('sakshi.helpReminders')}\n${t('sakshi.helpFamily')}\n${t('sakshi.helpGames')}\n${t('sakshi.helpEmergency')}\n${t('sakshi.helpTime')}\n${watchConnectedRef.current ? '❤️ Monitor your heart rate and health\n🚶 Track your steps and activity\n😴 Check your sleep quality\n' : ''}\n${t('sakshi.justTalk')}`)
      return
    }

    // ── 10. THANK YOU ──
    if (lower.match(/\b(thank|thanks|dhanyavaad|shukriya|thanks a lot|dhonyabad)\b/)) {
      addBotMessage(`You're welcome, ${name}! 💜 I'm always here for you. Is there anything else you'd like to know?`)
      return
    }

    // ── 11. JOKES / FUN ──
    if (lower.match(/\b(joke|funny|make me laugh|hasa|maza|mazak|entertain)\b/)) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "What do you call a fake noodle? An impasta! 🍝😄",
        "Why did the scarecrow win an award? He was outstanding in his field! 🌾😂",
        "What do you call a bear with no teeth? A gummy bear! 🐻😄",
        "Why don't eggs tell jokes? They'd crack each other up! 🥚😂"
      ]
      addBotMessage(jokes[Math.floor(Math.random() * jokes.length)])
      return
    }

    // ── 12. GENERAL KNOWLEDGE ──
    if (lower.match(/\b(what is|tell me about|explain|kya hai|kya hota|meaning of|define)\b/)) {
      if (lower.includes('brahmi')) {
        addBotMessage(`**Brahmi AI** is your personal cognitive care assistant! 🧠\n\nNamed after the Brahmi herb (Bacopa monnieri), which is known in Ayurveda for boosting memory and brain health.\n\nI'm here to help you stay connected with your memories, manage your daily routine, and keep your mind active! 💜`)
      } else if (lower.includes('dementia')) {
        addBotMessage(`**Dementia** is a condition that affects memory, thinking, and social abilities. It can make daily tasks challenging.\n\nThat's why Brahmi AI exists — to help you stay connected with your memories through personalized activities, family photos, and daily routines. 💜\n\nYou're doing great by using this app!`)
      } else if (lower.includes('memory') || lower.includes('brain')) {
        addBotMessage(`Your **memory** is like a garden — the more you tend to it, the better it grows! 🌱\n\nPlaying memory games, looking at family photos, and following daily routines all help keep your mind sharp.\n\nWould you like to play a memory game right now? 🧠`)
      } else {
        addBotMessage(`I'm not sure I understand that fully, but I'm here to help! 😊\n\nYou can ask me about:\n• 📋 Your schedule or next task\n• ⏰ What time something is\n• 👨‍👩‍👧 Your family members\n• 🎮 Games to play\n• 🆘 Getting help\n• 😄 A joke to brighten your day\n\nWhat would you like to know?`)
      }
      return
    }

    // ── 13. GREETINGS ──
    if (lower.match(/\b(hello|hi|hey|namaste|namaskar|sup|yo|pranam)\b/) && lower.length < 15) {
      addBotMessage(`${getGreetingText(t)}, ${name}! 🌸\n\nHow can I help you today?\n\nYou can ask me about your schedule, family, games, or anything else!`)
      return
    }

    // ── 14. DEFAULT (smart fallback) ──
    // Try to find any useful context from the message
    const scheduleHint = schedule.find(s => lower.includes(s.title.toLowerCase().split(' ')[0]))
    if (scheduleHint) {
      addBotMessage(`I see you're asking about **${scheduleHint.title}**! 📋\n\nIt's scheduled for ${scheduleHint.time}.${scheduleHint.notes ? `\n📝 ${scheduleHint.notes}` : ''}\n\nI'll remind you when it's time!`)
      return
    }

    addBotMessage(`I'm not sure I understand that fully, but I'm here to help! 😊\n\nYou can ask me about:\n• 📋 Your schedule or next task\n• ⏰ What time something is\n• 👨‍👩‍👧 Your family members\n• 🎮 Games to play\n• 🆘 Getting help\n• 😄 A joke to brighten your day\n\nWhat would you like to know?`)
  }

  const getScheduleSummary = () => {
    if (schedule.length === 0) return 'No reminders set for today.'

    const currentMinutes = getISTTotalMinutes()

    // Get upcoming items (within next 3 hours) and recent items (within last 1 hour)
    const upcoming = []
    const recent = []

    schedule.forEach(s => {
      const mins = parseTimeToMinutes(s.time)
      if (mins === null) return
      const diff = mins - currentMinutes
      if (diff > 0 && diff <= 180) upcoming.push(s)
      if (diff >= -60 && diff <= 0) recent.push(s)
    })

    if (upcoming.length > 0) {
      const items = upcoming.slice(0, 3).map(s => `${s.title} ${s.time}`)
      return `Coming up soon: ${items.join(', ')}.`
    }

    if (recent.length > 0) {
      const items = recent.map(s => s.title)
      return `You just had ${items.join(' & ')}. Hope it went well!`
    }

    // Fallback: show the next few items from now
    const sortedFuture = schedule
      .map(s => ({ ...s, mins: parseTimeToMinutes(s.time) }))
      .filter(s => s.mins !== null && s.mins > currentMinutes)
      .sort((a, b) => a.mins - b.mins)

    if (sortedFuture.length > 0) {
      const items = sortedFuture.slice(0, 3).map(s => `${s.title} ${s.time}`)
      return `Today's upcoming: ${items.join(', ')}.`
    }

    return "You've completed all your activities for today! Great job! 🎉"
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-primary-500 to-teal-500
          shadow-xl shadow-primary-500/30
          flex items-center justify-center
          text-white
          ${isOpen ? 'hidden' : ''}
        `}
      >
        <MessageCircle size={24} />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 animate-ping opacity-20" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-teal-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrahmiLogo size={36} />
                <div>
                  <h3 className="text-white font-semibold text-sm">Sakshi</h3>
                  <p className="text-white/70 text-xs">{t('sakshi.headerSubtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {voiceEnabled ? (
                    <Volume2 size={16} className="text-white/80" />
                  ) : (
                    <VolumeX size={16} className="text-white/60" />
                  )}
                </button>
                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel()
                    setIsOpen(false)
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={16} className="text-white/80" />
                </button>
              </div>
            </div>

            {/* Emergency Banner */}
            <AnimatePresence>
              {emergencyMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500 px-4 py-2 overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-white text-xs font-medium">
                    <AlertTriangle size={14} className="animate-pulse" />
                    {t('sakshi.emergencyActive')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'sakshi' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <BrahmiLogo size={16} />
                    </div>
                  )}
                  <div
                    className={`
                      max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                      ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-teal-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center">
                    <BrahmiLogo size={16} />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => handleUserMessage('What is my next task?')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  {t('sakshi.quickActions.nextTask')}
                </button>
                <button
                  onClick={() => handleUserMessage('How is my schedule today?')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  {t('sakshi.quickActions.fullSchedule')}
                </button>
                <button
                  onClick={() => handleUserMessage('I want to play games')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 text-xs font-medium hover:bg-teal-100 transition-colors"
                >
                  {t('sakshi.quickActions.games')}
                </button>
                <button
                  onClick={() => handleUserMessage('Tell me about my family')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 transition-colors"
                >
                  {t('sakshi.quickActions.family')}
                </button>
                <button
                  onClick={() => handleUserMessage('What time is it?')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium hover:bg-amber-100 transition-colors"
                >
                  {t('sakshi.quickActions.time')}
                </button>
                <button
                  onClick={() => handleUserMessage('Tell me a joke')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-medium hover:bg-violet-100 transition-colors"
                >
                  {t('sakshi.quickActions.joke')}
                </button>
              </div>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-3 pb-2"
              >
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-50 border border-primary-100">
                  <div className="flex gap-0.5">
                    <span className="w-1 h-3 bg-primary-500 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-3.5 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                  </div>
                  <span className="text-xs text-primary-600 font-medium">
                    {interimText || t('sakshi.listening')}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-primary-300 transition-colors">
                <input
                  type="text"
                  value={isListening ? interimText : inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUserMessage(inputText)
                    }
                  }}
                  placeholder={isListening ? t('sakshi.listening') : t('sakshi.talkToSakshi')}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  readOnly={isListening}
                />
                {/* Microphone button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Mic size={14} />
                </motion.button>
                <button
                  onClick={() => handleUserMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="p-1.5 rounded-lg bg-primary-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Emergency Button */}
            <div className="px-3 pb-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setEmergencyMode(true)
                  handleUserMessage('I need help urgently')
                  // Also send SMS
                  import('../../utils/emergencyService.js').then(({ sendEmergencySMS, isValidPhone }) => {
                    const phone = emergencyContact?.phone
                    if (phone && isValidPhone(phone)) {
                      sendEmergencySMS(phone, patientName, 'Emergency button pressed via Sakshi AI')
                    }
                  }).catch(() => {})
                }}
                className="w-full py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
              >
                <MessageSquare size={14} />
                {t('sakshi.emergencyCall')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
