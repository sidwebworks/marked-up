import { templatesAtom } from "@lib/store/editor-atoms";
import { useAtom, useAtomValue } from "jotai";
import React, { DragEventHandler, FC } from "react";
import { useDomElement } from "src/hooks/use-dom-element";

interface StructureEditorProps {}

type Template = { id: string; name: string; content: string };

const StructureEditor: React.FC<StructureEditorProps> = () => {
  const templates = useAtomValue(templatesAtom);

  return (
    <div className=" m-4 h-full gap-2 flex-grow flex-1 ">
      {templates.map((el) => (
        <TemplateItem
          id={el.id}
          name={el.name}
          key={el.id}
          content={el.content}
        />
      ))}
      <div className="inset-0 mx-2 pointer-events-none absolute p-2 border-2 border-dashed border-dark-400 " />
    </div>
  );
};

const TemplateItem: FC<Template> = ({ content, name }) => {
  const handleDrag: DragEventHandler = (ev) => {
    ev.dataTransfer!.setData("text", content);
  };

  return (
    <li
      onDragStart={handleDrag}
      draggable="true"
      className="p-3 text-lg transition my-2.5 hover:text-cyan-500 cursor-move relative z-10 list-none rounded-md text-true-gray-500 rounded-md bg-dark-500"
    >
      {name}
    </li>
  );
};

TemplateItem.displayName = "TemplateItem";

export default StructureEditor;
