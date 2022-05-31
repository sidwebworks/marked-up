import { hostname } from "os";

export function clsx(...str: string[]) {
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
