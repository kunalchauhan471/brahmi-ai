import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, X, Mic, Send, Phone, Volume2, VolumeX,
  Brain, AlertTriangle, Gamepad2, Heart
} from 'lucide-react'
import { useData } from '../../context/DataContext'

function speak(text, onEnd) {
  if (!('speechSynthesis' in window)) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1.1
  utterance.volume = 1

  const voices = window.speechSynthesis.getVoices()
  const femaleVoice = voices.find(
    v => v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('karen') ||
         v.name.toLowerCase().includes('victoria') ||
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('hazel') ||
         v.name.toLowerCase().includes('google uk english female') ||
         v.name.toLowerCase().includes('microsoft zira') ||
         v.name.toLowerCase().includes('microsoft hazel') ||
         v.name.toLowerCase().includes('fiona') ||
         v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  )
  if (femaleVoice) utterance.voice = femaleVoice
  else {
    const anyFemale = voices.find(v => v.name.toLowerCase().includes('female'))
    if (anyFemale) utterance.voice = anyFemale
  }

  utterance.onend = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}

function getGreetingText(name) {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning`
  if (hour < 17) return `Good afternoon`
  return `Good evening`
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

const MOOD_RESPONSES = {
  good: ["That's wonderful to hear! It makes me so happy when you're feeling well.", "Great! A good mood makes everything better. Let's have a wonderful day!"],
  fine: ["I'm glad you're doing okay. If there's anything I can do to make your day better, just let me know!", "That's good to hear. I'm here whenever you need me."],
  bad: ["I'm sorry to hear that. Please take it easy today. Would you like me to call someone for you?", "I understand. Remember, it's okay to feel this way. I'm right here with you."],
  default: ["Thank you for sharing that with me. I'm always here for you!", "I appreciate you telling me how you feel. Let's take it one step at a time today."]
}

export default function SakshiAssistant({ triggerReminder }) {
  const navigate = useNavigate()
  const { patientData, schedule, memories } = useData()
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
        `Hey ${name}, it's time for your ${triggerReminder.title}! 😊`,
        `${name}, gentle reminder — it's ${triggerReminder.title} time. ${triggerReminder.notes || ''} 💊`,
        `Hi ${name}! Just reminding you that it's time for ${triggerReminder.title}. ${triggerReminder.notes || 'Hope you\'re doing well!'}`,
        `${name}, this is your ${triggerReminder.title} reminder. ${triggerReminder.notes || 'Take care of yourself!'}`,
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
      const greeting = getGreetingText(name)

      const introMessages = [
        {
          id: Date.now(),
          text: `${greeting}, ${name}! 🌸`,
          sender: 'sakshi',
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          text: `I'm Sakshi, your personal assistant. How are you feeling today?`,
          sender: 'sakshi',
          timestamp: new Date(),
        },
      ]

      setMessages(introMessages)

      if (voiceEnabled) {
        speak(`${greeting}, ${name}! I'm Sakshi, your personal assistant. How are you feeling today?`)
      }
    }
  }, [isOpen, greeted, patientData.name, voiceEnabled])

  // Speech Recognition setup
  const getRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null
    if (recognitionRef.current) return recognitionRef.current
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

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
      if (voiceEnabled) speak(text)
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

    // Check for emergency
    if (detectEmergency(text)) {
      setEmergencyMode(true)
      addBotMessage(
        `I understand you need help. I'm connecting you to your emergency contact right now. Stay calm, help is on the way. 🆘`,
        500
      )
      setTimeout(() => {
        addBotMessage(`📞 Calling ${patientData.name ? 'your emergency contact' : 'emergency contact'}... If this is a real emergency, please also dial 112 or your local emergency number.`, 1500)
      }, 100)
      return
    }

    // Mood detection
    const lower = text.toLowerCase()
    if (lower.includes('good') || lower.includes('great') || lower.includes('happy') || lower.includes('wonderful') || lower.includes('excellent')) {
      const responses = MOOD_RESPONSES.good
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      setTimeout(() => {
        const scheduleText = getScheduleSummary()
        addBotMessage(`Here's what you have planned today: ${scheduleText} Would you like to play some fun games? 🎮`, 1500)
      }, 200)
      return
    }
    if (lower.includes('fine') || lower.includes('okay') || lower.includes('ok') || lower.includes('alright')) {
      const responses = MOOD_RESPONSES.fine
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      setTimeout(() => {
        const scheduleText = getScheduleSummary()
        addBotMessage(`Let me tell you about today: ${scheduleText} You can also play memory games anytime! Just tap the game cards. 🧠`, 1500)
      }, 200)
      return
    }
    if (lower.includes('bad') || lower.includes('sad') || lower.includes('tired') || lower.includes('not good') || lower.includes('sick') || lower.includes('pain')) {
      const responses = MOOD_RESPONSES.bad
      addBotMessage(responses[Math.floor(Math.random() * responses.length)])
      return
    }

    // Schedule queries
    if (lower.includes('schedule') || lower.includes('today') || lower.includes('plan') || lower.includes('remind') || lower.includes('what to do')) {
      const scheduleText = getScheduleSummary()
      addBotMessage(`Here's your full schedule for today: ${scheduleText} I'll remind you when it's time for each activity! ⏰`)
      return
    }

    // Family/memory queries (checked BEFORE games so compound messages work)
    if (lower.includes('family') || lower.includes('photo') || lower.includes('memory') || lower.includes('who is') || lower.includes('talk') || lower.includes('relative') || lower.includes('son') || lower.includes('daughter') || lower.includes('wife') || lower.includes('husband')) {
      if (memories.length > 0) {
        const familyList = memories.map(m => `${m.emoji} ${m.name} (${m.relationship})`).join(', ')
        addBotMessage(`Here are the people in your memory vault: ${familyList}\n\nWould you like to know more about someone specific? Just tell me their name! 📸`)
      } else {
        addBotMessage(`No memories have been uploaded yet. Ask your caregiver to add family photos so we can connect with your loved ones! 📸`)
      }
      return
    }

    // Games queries (only if no negative sentiment about games)
    const wantsGames = lower.includes('game') || lower.includes('play') || lower.includes('bored') || lower.includes('fun')
    const rejectsGames = lower.includes('no') || lower.includes('don') || lower.includes('not want') || lower.includes('skip') || lower.includes('instead')
    if (wantsGames && !rejectsGames) {
      addBotMessage(`Yes! You can play games right below on this page! 🎮\n\nScroll down to see the Fun Activities section — tap any game card to start playing.\n\nYou can also say \'View All\' to see all 6 games!`, 500)
      return
    }

    // Affirmative responses after being asked about games
    const isYes = lower.includes('yes') || lower.includes('sure') || lower.includes('yeah') || lower.includes('ok') || lower.includes('let') || lower.includes('take me')
    if (isYes) {
      addBotMessage(`Great! Scroll down on this page and you'll see the Fun Activities cards — tap any game to start! 🎮\n\nOr I can take you to the full games page.`, 500)
      return
    }

    // Help/about sakshi
    if (lower.includes('who are you') || lower.includes('about you') || lower.includes('what can you do')) {
      addBotMessage(`I'm Sakshi, your personal care assistant! 💜\n\nI can:\n• Tell you about your daily schedule\n• Remind you to take medicine and meals\n• Help you play memory games\n• Connect you with family\n• Call for help when you need it\n\nJust talk to me anytime!`)
      return
    }

    // Thank you
    if (lower.includes('thank') || lower.includes('thanks')) {
      addBotMessage(`You're welcome! I'm always here for you. 💜 Is there anything else you'd like to know?`)
      return
    }

    // Default
    addBotMessage(`I heard you! I'm here to help with your daily schedule, remind you about medicines, play fun games, or connect you with your family. What would you like to do? 😊`)
  }

  const getScheduleSummary = () => {
    if (schedule.length === 0) return "No reminders set for today."

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const parseTime = (timeStr) => {
      const cleaned = timeStr.trim()
      const isPM = /PM/i.test(cleaned)
      const isAM = /AM/i.test(cleaned)
      const withoutMeridiem = cleaned.replace(/\s*(AM|PM)/i, '').trim()
      const parts = withoutMeridiem.split(':')
      if (parts.length !== 2) return null
      let hours = parseInt(parts[0], 10)
      const minutes = parseInt(parts[1], 10)
      if (isNaN(hours) || isNaN(minutes)) return null
      if (isPM && hours !== 12) hours += 12
      if (isAM && hours === 12) hours = 0
      return hours * 60 + minutes
    }

    // Get upcoming items (within next 3 hours) and recent items (within last 1 hour)
    const upcoming = []
    const recent = []

    schedule.forEach(s => {
      const mins = parseTime(s.time)
      if (mins === null) return
      const diff = mins - currentMinutes
      if (diff > 0 && diff <= 180) upcoming.push(s)
      if (diff >= -60 && diff <= 0) recent.push(s)
    })

    if (upcoming.length > 0) {
      const items = upcoming.slice(0, 3).map(s => `${s.title} at ${s.time}`)
      return `Coming up soon: ${items.join(', ')}.` 
    }

    if (recent.length > 0) {
      const items = recent.map(s => s.title)
      return `You just had ${items.join(' and ')}. Hope it went well!`
    }

    // Fallback: show the next few items from now
    const sortedFuture = schedule
      .map(s => ({ ...s, mins: parseTime(s.time) }))
      .filter(s => s.mins !== null && s.mins > currentMinutes)
      .sort((a, b) => a.mins - b.mins)

    if (sortedFuture.length > 0) {
      const items = sortedFuture.slice(0, 3).map(s => `${s.title} at ${s.time}`)
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
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Sakshi</h3>
                  <p className="text-white/70 text-xs">Your Care Assistant</p>
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
                    Emergency mode active — Help is on the way
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
                      <Brain size={12} className="text-white" />
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
                    <Brain size={12} className="text-white" />
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
                  onClick={() => handleUserMessage('How is my schedule today?')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                >
                  📋 Today's Schedule
                </button>
                <button
                  onClick={() => handleUserMessage('I want to play games')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 text-xs font-medium hover:bg-teal-100 transition-colors"
                >
                  🎮 Play Games
                </button>
                <button
                  onClick={() => handleUserMessage('Tell me about my family')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 transition-colors"
                >
                  👨‍👩‍👧 Family
                </button>
                <button
                  onClick={() => handleUserMessage('I need help')}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  🆘 Need Help
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
                    {interimText || "Listening..."}
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
                  placeholder={isListening ? "Listening..." : "Talk to Sakshi..."}
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
                }}
                className="w-full py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
              >
                <Phone size={14} />
                Emergency Call
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
