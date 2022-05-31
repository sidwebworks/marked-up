import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { editor } from "monaco-editor";
import { normalizeThemeName } from "src/components/editor/monaco.helpers";
import { settings } from "./settings-atom";

export const codeAtom = atomWithStorage("__ACTIVE_FILE__", "");

export const optionsAtom = atom<editor.IStandaloneEditorConstructionOptions>(
  (get) => {
    return {
      scrollbar: { verticalScrollbarSize: 10 },
      minimap: { enabled: false },
      fontSize: 15,
      lineNumbers: "off",
      language: "markdown",
      guides: { bracketPairs: false, indentation: false },
      wordWrap: "on",
      cursorSmoothCaretAnimation: true,
      scrollBeyondLastLine: false,
      padding: { top: 20, bottom: 20 },
      theme: normalizeThemeName(get(settings).currentTheme),
    };
  }
);
