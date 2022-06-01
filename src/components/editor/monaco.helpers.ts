import { createFileSystem, toGitRaw } from "@lib/utilities";
import { editor } from "monaco-editor";
import { DragEvent, MutableRefObject } from "react";
import { Selectable } from "../shared/Select";

export type Instance = editor.IStandaloneCodeEditor;

const fs = createFileSystem("__THEME_FILES__");

export const loadTheme = async (input: Selectable<string>) => {
  const inCache = await fs.getItem(input.label);

  if (inCache) {
    return inCache;
  }

  const encodedName = encodeURI(input.label);

  const url = toGitRaw(
    `https://github.com/brijeshb42/monaco-themes/blob/master/themes/${encodedName}.json`
  );

  const theme = await (await fetch(url)).json();

  await fs.setItem(input.label, theme);

  return theme;
};

export type TDropHandler = (
  e: React.DragEvent<HTMLDivElement>,
  target: editor.IMouseTarget,
  instance: Instance
) => void;

export type TInstanceRef = MutableRefObject<Instance | undefined>;

type DndControllerState = {
  target: editor.IMouseTarget | null;
  node: HTMLDivElement | null;
  widget: editor.IContentWidget | null;
};

export function createDndController(
  instanceRef: TInstanceRef,
  handler: TDropHandler
) {
  const state: DndControllerState = {
    target: null,
    node: null,
    widget: null,
  };

  const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
    if (!instanceRef.current) return;
    const instance = instanceRef.current;

    const target = instance.getTargetAtClientPoint(ev.clientX, ev.clientY);

    showDropPosition(instance, target!);
    ev.preventDefault();
  };

  const onDrop = (ev: DragEvent<HTMLDivElement>) => {
    if (!instanceRef.current || !state.target) return;
    handler && handler(ev, state.target, instanceRef.current);
    onCleanup();
  };

  const createMouseDropWidget = () => {
    if (!state.node) {
      state.node = document.createElement("div");
      state.node.className = "drop-target  animate-skeleton";
      state.node.innerText = "DROP TO INSERT HERE";
    }

    return {
      getId: () => "drag",
      getDomNode: () => state.node as HTMLDivElement,
      getPosition: () => ({
        position: state.target!.position,
        preference: [0, 0],
      }),
    };
  };

  const showDropPosition = (
    instance: Instance,
    target: editor.IMouseTarget
  ) => {
    state.target = target;

    if (state.widget) {
      instance.layoutContentWidget(state.widget);
    } else {
      state.widget = createMouseDropWidget();
      instance.addContentWidget(state.widget);
    }
  };

  const onCleanup = () => {
    const instance = instanceRef.current;
    if (instance && state.widget && state.node) {
      instance.removeContentWidget(state.widget);
      state.widget = null;
    }
  };

  const getContainerProps = () => ({
    onDragOver,
    onDropCapture: onDrop,
    onDragLeaveCapture: onCleanup,
  });

  return {
    getContainerProps,
  };
}
