import { create } from "zustand";

type LanguageState = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguageState = create<LanguageState>((set) => {
  return {
    language: "zh-TW",
    setLanguage: (language) => {
      set(() => ({ language }));
    },
  };
});
