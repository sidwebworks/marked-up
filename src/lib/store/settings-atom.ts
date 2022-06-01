import { toGitRaw } from "@lib/utilities";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toArray } from "lodash-es";
import { isSSR } from "src/hooks/use-isomorphic-effect";

const fetchThemes = async () => {
  try {
    const res = await fetch(
      toGitRaw(
        "https://github.com/brijeshb42/monaco-themes/blob/master/themes/themelist.json"
      )
    );

    const themes = await res.json();

    const transformed = Object.keys(themes).reduce<
      { label: string; value: string }[]
    >((acc, curr) => {
      acc.push({ label: themes[curr], value: curr });

      return acc;
    }, []);

    return transformed;
  } catch (error) {
    return [];
  }
};

export const themeAtom = atom(() => {
  if (isSSR) {
    return [];
  }
  return fetchThemes();
});

export const settings = atomWithStorage("APP_SETTINGS", {
  editor: {
    scrollSync: true,
    wordWrap: true,
    currentTheme: { value: "vs-dark", label: "Vs Dark" },
    cursorStyle: { label: "Block", value: "block" },
  },
});




