import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from './locales/en.json'
import hi from './locales/hi.json'
import as from './locales/as.json'
import bn from './locales/bn.json'
import mni from './locales/mni.json'
import mz from './locales/mz.json'
import kha from './locales/kha.json'
import gar from './locales/gar.json'
import ne from './locales/ne.json'
import brx from './locales/brx.json'
import kok from './locales/kok.json'

const translations = { en, hi, as, bn, mni, mz, kha, gar, ne, brx, kok }

const LANGUAGE_KEY = 'brahmi-language'

// Always default to English
const storedLang = 'en'

const LanguageContext = createContext()

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mni', name: 'Manipuri (Meitei)', native: 'মৈতৈলোন্' },
  { code: 'mz', name: 'Mizo', native: 'Mizo ṭawng' },
  { code: 'kha', name: 'Khasi', native: 'Khasi' },
  { code: 'gar', name: 'Garo', native: 'A\'chik' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' },
  { code: 'kok', name: 'Kokborok', native: 'Kokborok' },
]

// Pages where translations should apply (patient experience)
const PATIENT_ROUTES = ['/patient', '/games']

function isPatientPage() {
  const path = window.location.pathname
  return PATIENT_ROUTES.some(route => path.startsWith(route))
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object') return acc[part]
    return undefined
  }, obj)
}

export function LanguageProvider({ children, location }) {
  const [storedLanguage, setStoredLanguage] = useState(storedLang)

  const setLanguage = useCallback((lang) => {
    setStoredLanguage(lang)
    localStorage.setItem(LANGUAGE_KEY, lang)
  }, [])

  // Always use English
  const language = 'en'

  const t = useCallback((key, fallback) => {
    const langData = translations[language] || translations.en
    const value = getNestedValue(langData, key)
    if (value !== undefined) return value
    // Fallback to English
    const enValue = getNestedValue(translations.en, key)
    if (enValue !== undefined) return enValue
    return fallback || key
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}
