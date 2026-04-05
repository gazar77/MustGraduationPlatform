import React, { createContext, useContext, useReducer, useEffect } from 'react';
import i18n from '../i18n';

export type Language = 'en' | 'ar';

type LanguageAction = { type: 'SET_LANGUAGE'; payload: Language };

const languageReducer = (state: Language, action: LanguageAction): Language => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      localStorage.setItem('language', action.payload);
      document.documentElement.dir = action.payload === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = action.payload;
      // Sync with i18next
      if (i18n.language !== action.payload) {
        i18n.changeLanguage(action.payload);
      }
      return action.payload;
    default:
      return state;
  }
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  dispatch: React.Dispatch<LanguageAction>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, dispatch] = useReducer(languageReducer, (localStorage.getItem('language') as Language) || 'en');

  // Sync initial state with i18n and DOM
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []);

  const t = (key: string): string => {
    return i18n.t(key);
  };

  return (
    <LanguageContext.Provider value={{ language, t, dispatch }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};


