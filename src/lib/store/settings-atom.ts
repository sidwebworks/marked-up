import { toGitRaw } from "@lib/utilities";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { isSSR } from "src/hooks/use-isomorphic-effect";

const fetchThemes = async () => {
  const res = await fetch(
    toGitRaw(
      "https://github.com/brijeshb42/monaco-themes/blob/master/themes/themelist.json"
    )
  );
  const themes = await res.json();

  return themes;
};

export const themeAtom = atom(async () => {
  if (isSSR) {
    return [];
  }

  return fetchThemes();
});

export const settings = atomWithStorage("__APP_SETTINGS__", {
  scrollSync: true,
  currentTheme: "vs-dark",
});
