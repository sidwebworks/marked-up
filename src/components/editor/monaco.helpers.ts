import { toGitRaw } from "@lib/utilities";
import localforage from "localforage";

export const createFileSystem = (name: string) => {
  const client = localforage.createInstance({ name });

  return {
    async getItem(key: string) {
      const item = await client.getItem(key);
      return item;
    },
    async setItem(key: string, data: unknown) {
      await client.setItem(key, data);
    },
  };
};

const fs = createFileSystem("__THEME_FILES__");

export const loadTheme = async (name: string) => {
  const inCache = await fs.getItem(name);

  if (inCache) {
    return inCache;
  }

  const encodedName = encodeURI(name);

  const url = toGitRaw(
    `https://github.com/brijeshb42/monaco-themes/blob/master/themes/${encodedName}.json`
  );

  const theme = await (await fetch(url)).json();

  await fs.setItem(name, theme);

  return theme;
};

export function normalizeThemeName(str: string) {
  return str
    .toLowerCase()
    .replace(/[^A-Za-z']/g, "")
    .replace(/\s+/g, "-");
}
