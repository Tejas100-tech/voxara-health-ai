import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type LanguageCode, t, getBackendTranslation, LANGUAGES } from "./translations";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  getBackendT: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  getBackendT: (key: string) => key,
});

const LANG_KEY = "medikiosk.language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored && LANGUAGES.some((l) => l.code === stored)) {
        return stored as LanguageCode;
      }
    } catch {}
    return "en";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
    // Set html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const tFn = (key: string) => t(key, language);
  const backendTFn = (key: string) => getBackendTranslation(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: tFn, getBackendT: backendTFn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
