import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, translations, tOption } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
  tOpt: (value: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (p) => p,
  tOpt: (v) => v,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("northvoy_lang");
    if (saved === "en" || saved === "tr" || saved === "de") return saved;
    return "en";
  });

  // Keep <html lang="..."> in sync with selected language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("northvoy_lang", l);
  }

  function t(path: string): string {
    const keys = path.split(".");
    let obj: unknown = translations[lang];
    for (const k of keys) {
      if (obj && typeof obj === "object") {
        obj = (obj as Record<string, unknown>)[k];
      } else return path;
    }
    return typeof obj === "string" ? obj : path;
  }

  function tOpt(value: string): string {
    return tOption(lang, value);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tOpt }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
