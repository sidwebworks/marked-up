import { atom, useAtom, WritableAtom } from "jotai";
import type { editor } from "monaco-editor";

export type Template = {
  name: string;
  code: string;
};

export const templatesAtom = atom<Template[]>([
  {
    name: "Project Title",
    code: `
    # Project Title
    A brief description of what this project does and who it's for
`,
  },
  {
    name: "Contributors",
    code: `
    # Project Title
    A brief description of what this project does and who it's for
`,
  },
]);

export const isSettingsOpen = atom(false, (get, set, next) => {
  const update = next ?? !get(isSettingsOpen);
  set(isSettingsOpen, update);
});

export const isPreviewOpen = atom(false, (get, set, next) => {
  const update = next ?? !get(isPreviewOpen);
  set(isPreviewOpen, update);
});
