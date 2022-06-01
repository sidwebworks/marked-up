import { BeakerIcon, ClipboardCopyIcon } from "@heroicons/react/outline";
import { codeAtom, optionsAtom } from "@lib/store/editor-atoms";
import { settings } from "@lib/store/settings-atom";
import { normalizeThemeName } from "@lib/utilities";
import MonacoEditor, { OnMount, useMonaco } from "@monaco-editor/react";
import { useAtom, useAtomValue } from "jotai";
import { Range, Selection } from "monaco-editor/esm/vs/editor/editor.api";
import React, { DragEvent, Fragment, useRef } from "react";
import toast from "react-hot-toast";
import { useDomElement } from "../../hooks/use-dom-element";
import { useIsomorphicEffect } from "../../hooks/use-isomorphic-effect";
import { createDndController, Instance, loadTheme } from "./monaco.helpers";

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

const Editor: React.FC = () => {
  const editorRef = useRef<Instance>();
  const options = useAtomValue(optionsAtom);
  const { scrollSync, currentTheme } = useAtomValue(settings);
  const [code, setCode] = useAtom(codeAtom);
  const preview = useDomElement("#preview");
  const monacoInstance = useMonaco();

  const handleDrop = (e: DragEvent<HTMLDivElement>, target: any) => {
    e.preventDefault();

    const text = e.dataTransfer.getData("text");
    const editor = editorRef.current;

    if (!text.trim() || !editor) return;

    const { lineNumber, column } = target.position;

    const line = lineNumber === 0 ? -1 : lineNumber;

    insertTextAtPos(editor, `\n${text.trim()}\n`, [line, column], true);

    handleFormat();
  };

  const controller = useRef(createDndController(editorRef, handleDrop));

  useIsomorphicEffect(() => {
    const name = normalizeThemeName(currentTheme.value);

    loadTheme(currentTheme).then((theme) => {
      if (!monacoInstance?.editor) return;
      monacoInstance!.editor.defineTheme(name, theme);
      monacoInstance!.editor.setTheme(name);
    });
  }, [monacoInstance, currentTheme]);

  //TODO: Refactor this to a custom hook?
  useIsomorphicEffect(() => {
    let disposables: any[] = [];

    if (scrollSync) {
      disposables.push(
        editorRef.current?.onDidScrollChange((e) => {
          if (!preview || !editorRef.current) return;

          const pageH = e.scrollHeight - preview.clientHeight;
          const pageT = e.scrollTop - preview.offsetTop;
          const result =
            (pageT / pageH) * (preview.scrollHeight - preview.offsetHeight);

          preview.scrollTop = result;
        })
      );
    }
    return () => {
      disposables.forEach((d) => d?.dispose());
    };
  }, [preview, editorRef.current, scrollSync]);

  const handleFormat = async () => {
    const md = editorRef.current?.getValue() || "";
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

    const content = editorRef.current?.getValue() || "";

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

  const onEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => setCode(editor.getValue()));
  };

  return (
    <Fragment>
      <header className="max-w-max absolute   top-0 z-10 px-3 flex py-1.5 gap-3 right-2 top-1 justify-end items-center">
        <button
          onClick={handleFormat}
          className="stroke-current focusable active:scale-95 transform  center rounded-full bg-dark-500 px-4 py-1 text-green-400"
        >
          <BeakerIcon strokeWidth={1.3} className="w-6 h-6" />
        </button>

        <button className="stroke-current focusable active:scale-95 transform  center rounded-full bg-dark-500 px-4 py-1 text-cyan-400">
          <ClipboardCopyIcon
            onClick={handleCopy}
            strokeWidth={1.3}
            className="w-6 h-6"
          />
        </button>
      </header>
      <MonacoEditor
        onMount={onEditorDidMount}
        wrapperProps={controller.current.getContainerProps()}
        language={"markdown"}
        value={code}
        loading=""
        options={options}
        height={"100%"}
      />
    </Fragment>
  );
};

export default Editor;
