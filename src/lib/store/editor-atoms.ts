import { normalizeThemeName } from "@lib/utilities";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { editor } from "monaco-editor";
import { settings } from "./settings-atom";

export const codeAtom = atomWithStorage("__ACTIVE_FILE__", "");

export const optionsAtom = atom<editor.IStandaloneEditorConstructionOptions>(
  (get) => {
    return {
      scrollbar: { verticalScrollbarSize: 10 },
      minimap: { enabled: false },
      fontSize: 15,
      lineNumbers: "off",
      cursorStyle: "block-outline",
      language: "markdown",
      guides: { bracketPairs: false, indentation: false },
      wordWrap: "on",
      cursorSmoothCaretAnimation: true,
      scrollBeyondLastLine: false,
      padding: { top: 20, bottom: 20 },
      theme: normalizeThemeName(get(settings).currentTheme.label),
    };
  }
);

export type Template = {
  name: string;
  id: string;
  content: string;
};

export const templatesAtom = atomWithStorage<Template[]>("__TEMPLATES__", [
  { id: "1", name: "Title", content: "# Title" },
  {
    id: "2",
    name: "Banner Image",
    content: "![banner](https://picsum.photos/1200/450)",
  },
  {
    id: "3",
    name: "Badge",
    content:
      "[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)",
  },
  {
    id: "4",
    name: "Table of contents",
    content: `## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)
`,
  },
  {
    id: "5",
    name: "LICENSE",
    content: `## License
    
[MIT © Richard McRichface.](../LICENSE)
    `,
  },
]);
