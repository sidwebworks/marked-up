import { useAtom, useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import React, { Fragment, MouseEventHandler, useCallback } from "react";
import remarkGfm from "remark-gfm";
import { clsx, sanitizeHash } from "../../lib/utilities";
import { codeAtom } from "@lib/store/editor-atoms";
import { isPreviewOpen } from "@lib/store/ui-atoms";
import StructureEditor from "./StructureEditor";

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

      if (!found) return;

      found.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, []);

  return (
    <Fragment>
      <div className="flex flex-1 sticky z-20 top-0 p-2 gap-1 border-b-2 border-b-dark-500 bg-dark-800 text-dark-100  justify-between items-center">
        <button
          className={clsx(
            "focusable flex-grow rounded-md py-2",
            isPreview ? "bg-dark-400  text-cyan-500 " : "bg-dark-700"
          )}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
        <button
          onClick={() => setIsPreview(false)}
          className={clsx(
            "focusable flex-grow rounded-md py-2",
            !isPreview ? "bg-dark-400 text-cyan-500 py-2" : "bg-dark-700"
          )}
        >
          Structure
        </button>
      </div>
      <main className="relative min-h-[85%] p-0.5 mt-4">
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
          <StructureEditor />
        )}
      </main>
    </Fragment>
  );
};

export default Preview;
