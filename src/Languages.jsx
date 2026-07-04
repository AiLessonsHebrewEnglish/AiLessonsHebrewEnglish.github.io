import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    home: "Home",
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    logout: "Logout",
  },
  he: {
    home: "בית",
    login: "התחברות",
    signup: "הרשמה",
    dashboard: "לוח בקרה",
    logout: "התנתקות",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const toggleLanguage = () => {
    setLang(prev => (prev === "en" ? "he" : "en"));
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
