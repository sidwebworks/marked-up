import localforage from "localforage";
import { hostname } from "os";

export function clsx(...str: (string | boolean)[]) {
  return str.filter(Boolean).join(" ");
}

export function sanitizeHash(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace("?", "");
}

export function toGitRaw(url: string) {
  const BASE = "https://raw.githubusercontent.com";

  const _url = new URL(url);
  const parts = _url.pathname.split("/");
  const [user, repo, _, branch] = parts.slice(1, 5);
  const filename = parts.slice(parts.length - 2).join("/");

  const result = new URL(`${user}/${repo}/${branch}/${filename}`, BASE).href;
  return result; //?
}

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

export function normalizeThemeName(str: string) {
  if (typeof str !== "string") return "";

  return str
    .toLowerCase()
    .replace(/[^A-Za-z']/g, "")
    .replace(/\s+/g, "-");
}
