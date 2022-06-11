import { BeakerIcon, ClipboardCopyIcon } from "@heroicons/react/outline";
import { codeAtom, optionsAtom } from "@lib/store/editor-atoms";
import { settings } from "@lib/store/settings-atom";
import { normalizeThemeName } from "@lib/utilities";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { useAtom, useAtomValue } from "jotai";
import React, { Fragment, useRef } from "react";
import { useEditor } from "src/hooks/use-editor";
import { useDomElement } from "../../hooks/use-dom-element";
import { useIsomorphicEffect } from "../../hooks/use-isomorphic-effect";
import { Instance, loadTheme } from "./monaco.helpers";
import { useMonacoActions } from "./use-monaco-actions";

const Editor: React.FC = () => {
  const editorRef = useRef<Instance>();
  const options = useAtomValue(optionsAtom);
  const {
    editor: { scrollSync, currentTheme },
  } = useAtomValue(settings);

  const [code, setCode] = useAtom(codeAtom);

  const preview = useDomElement("#preview");
  const { monaco, update, editor } = useEditor();

  const { controller, handleCopy, handleFormat } = useMonacoActions(editorRef);

  useIsomorphicEffect(() => {
    const name = normalizeThemeName(currentTheme.value);

    if (currentTheme.value === "vs-dark") return;

    loadTheme(currentTheme).then((theme) => {
      if (!monaco?.editor) return;
      monaco!.editor.defineTheme(name, theme);
      monaco!.editor.setTheme(name);
    });
  }, [monaco, currentTheme]);

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
  }, [preview, editor, scrollSync]);

  const onEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => setCode(editor.getValue()));
    update((p) => ({ ...p, editor, monaco }));
  };

  return (
    <Fragment>
      <header className="max-w-max absolute   top-0 z-10 px-3 flex py-1.5 gap-3 right-2 top-1 justify-end items-center">
        <button
          onClick={handleFormat}
          className="stroke-current focusable active:scale-95 transform  center rounded-full bg-dark-800 px-4 py-1 text-green-400"
        >
          <BeakerIcon strokeWidth={1.3} className="w-6 h-6" />
        </button>

        <button className="stroke-current focusable active:scale-95 transform  center rounded-full bg-dark-800 px-4 py-1 text-cyan-400">
          <ClipboardCopyIcon
            onClick={handleCopy}
            strokeWidth={1.3}
            className="w-6 h-6"
          />
        </button>
      </header>
      <MonacoEditor
        onMount={onEditorDidMount}
        wrapperProps={controller.getContainerProps()}
        language={"markdown"}
        value={code}
        loading=""
        theme={options.theme}
        options={options}
        height={"100%"}
      />
    </Fragment>
  );
};

export default Editor;
