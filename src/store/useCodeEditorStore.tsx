import { create } from "zustand";
import { LANGUAGE_CONFIG } from "@/app/(home)/_constants";
import { Monaco } from "@monaco-editor/react";
import { CodeEditorState } from "@/types";

const getInitialState = () => {
  //initial load
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "github-dark",
    };
  }

  //after user selection
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "github-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;
  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorState = create<CodeEditorState>((set, get) => {
  const inititialState = getInitialState();
  return {
    ...inititialState,
    output: "",
    isRunning: false,
    error: null,
    executionResult: null,

    getCode: () => get().editor.getValue() || "",
    setEditor: (editor: Monaco) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);
      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string)=>{
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }
      set({
        language,
        output:"",
        error:null,
      });
    }
  };
});
