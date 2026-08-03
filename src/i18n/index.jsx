import React, { createContext, useContext } from 'react'

// Add a new entry here (plus a matching key in translations.jsx) to support another language.
export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: 'العربية', dir: 'rtl' }
]

export const getLanguageDir = (code) => {
  const lang = LANGUAGES.find((l) => l.code === code)
  return lang ? lang.dir : 'ltr'
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children, value }) => {
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}