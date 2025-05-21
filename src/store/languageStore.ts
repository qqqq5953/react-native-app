import { create } from "zustand";

type LanguageState = {
  language: { label: string; value: string };
  setLanguage: (language: { label: string; value: string }) => void;
};

export const useLanguageState = create<LanguageState>((set) => {
  return {
    language: { label: "Traditional Chinese", value: "zh-TW" },
    setLanguage: (language) => {
      set(() => ({ language }));
    },
  };
});
