import { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

type IEditorState = {
  monaco: Monaco | null;
  editor: editor.IStandaloneCodeEditor | null;
  update: Dispatch<
    SetStateAction<{
      monaco: Monaco | null;
      editor: editor.IStandaloneCodeEditor | null;
    }>
  >;
};

const EditorContext = createContext<IEditorState | null>(null);

export const EditorProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = useState<{
    monaco: Monaco | null;
    editor: editor.IStandaloneCodeEditor | null;
  }>({
    editor: null,
    monaco: null,
  });

  const ctx = useMemo<IEditorState>(
    () => ({ ...state, update: setState }),
    [state]
  );

  return (
    <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const value = useContext(EditorContext);

  if (!value && value === null) {
    throw new Error("useEditor must be wrapped inside EditorContextProvider");
  }

  return value;
};
