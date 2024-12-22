import { create } from "zustand";
import { LANGUAGE_CONFIG } from "@/app/home/_constants";
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
    editor: null,
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

    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }
      localStorage.setItem("editor-language", language);
      set({
        language,
        output: "",
        error: null,
      });
    },
    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();
      if (!code) {
        set({ error: "Code is empty" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });
        const data = await res.json();
        console.log("data from piston ", data);
        if (data.message) {
          set({
            error: data.message,
            executionResult: { code, output: "", error: data.message },
          });

          return;
        }

        // error handling

        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        const output = data.run.output;
        set({
          output: output.trim(),
          executionResult: { code, output: output.trim(), error: null },
        });
      } catch (error) {
        console.log("error from piston ", error);
        set({
          error: "ERROR RUNNING CODE",

          executionResult: {
            code,
            output: "",
            error: "ERROR RUNNING CODE",
          },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () =>
  useCodeEditorState.getState().executionResult;
