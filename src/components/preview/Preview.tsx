import { useAtom, useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import React, { Fragment, MouseEventHandler, useCallback } from "react";
import remarkGfm from "remark-gfm";
import { clsx, sanitizeHash } from "../../lib/utilities";
import { codeAtom } from "@lib/store/editor-atoms";
import { isPreviewOpen } from "@lib/store/ui-atoms";

const ReactMarkdown = dynamic<any>(() => import("react-markdown"));

const Preview: React.FC = () => {
  const code = useAtomValue(codeAtom);
  const [isPreview, setIsPreview] = useAtom(isPreviewOpen);

  const handleCapture: MouseEventHandler = useCallback((e) => {
    const target = e.target as HTMLAnchorElement;
    e.stopPropagation();

    if (
      typeof target.scrollIntoView === "function" &&
      target.tagName.toLowerCase() === "a"
    ) {
      const hash = target.href.split("#")[1].toLowerCase();

      const h2s = Array.from(
        document.querySelectorAll("article > .markdown-body h2")
      );

      const found = h2s.find((el) => sanitizeHash(el.innerHTML) === hash);

      console.log(found);

      if (!found) return;

      found.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, []);

  return (
    <div>
      <div className="grid sticky top-0 grid-cols-2 border-b-2 border-b-dark-400 text-dark-100 bg-dark-800 justify-between items-center">
        <button
          className={clsx(
            "focusable",
            isPreview ? "bg-dark-500 text-cyan-500 py-2" : ""
          )}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
        <button
          onClick={() => setIsPreview(false)}
          className={clsx(
            "focusable",
            !isPreview ? "bg-dark-500 text-cyan-500 py-2" : ""
          )}
        >
          Structure
        </button>
      </div>
      {isPreview ? (
        <article onClickCapture={handleCapture}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            skipHtml
            className="h-full markdown-body w-auto overflow-auto p-3"
          >
            {code}
          </ReactMarkdown>
        </article>
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default Preview;
