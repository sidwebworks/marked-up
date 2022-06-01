import { codeAtom } from "@lib/store/editor-atoms";
import { useSetAtom } from "jotai";
import { Range, Selection } from "monaco-editor/esm/vs/editor/editor.api";
import { DragEvent, useRef } from "react";
import toast from "react-hot-toast";
import { createDndController, Instance, TInstanceRef } from "./monaco.helpers";

const insertTextAtPos = (
  instance: Instance,
  text: string,
  coords: [number, number] = [0, 0],
  placeCursor: boolean = false
) => {
  const range = new Range(coords[0], coords[1], coords[0], coords[1]);
  if (placeCursor) {
    const selection = new Selection(coords[0], coords[1], coords[0], coords[1]);
    instance.executeEdits(
      "insert",
      [{ range, text, forceMoveMarkers: true }],
      [selection]
    );
    instance.focus();
  } else {
    instance.executeEdits("insert", [{ range, text, forceMoveMarkers: true }]);
  }
  instance.pushUndoStop();
};

export const useMonacoActions = (instance: TInstanceRef) => {
  const setCode = useSetAtom(codeAtom);

  const handleDrop = (e: DragEvent<HTMLDivElement>, target: any) => {
    e.preventDefault();

    const text = e.dataTransfer.getData("text");
    const editor = instance.current;

    if (!text.trim() || !editor) return;

    const { lineNumber, column } = target.position;

    const line = lineNumber === 0 ? -1 : lineNumber;

    insertTextAtPos(editor, `\n${text.trim()}\n`, [line, column], true);
  };

  const handleFormat = async () => {
    const md = instance.current?.getValue() || "";
    if (!md.trim()) return;

    const [prettier, parser] = await Promise.all([
      import("prettier/standalone"),
      import("prettier/parser-markdown"),
    ]);

    const result = prettier.format(md, {
      parser: "markdown",
      plugins: [parser],
    });

    setCode(result);
  };

  const handleCopy = async () => {
    await handleFormat();

    const content = instance.current?.getValue() || "";

    if (content.trim()) {
      navigator.clipboard
        .writeText(content.trim())
        .then(() => {
          toast.success("Copied to clipboard!");
        })
        .catch(() => {
          toast.error("Error copying to clipboard!");
        });
    }
  };

  const controller = useRef(createDndController(instance, handleDrop));

  return {
    controller,
    handleCopy,
    handleFormat,
    insertText: insertTextAtPos,
  };
};
