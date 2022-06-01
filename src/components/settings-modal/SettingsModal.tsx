import { Dialog, Tab, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import { EditorOptions } from "@lib/store/editor-atoms";
import { settings, themeAtom } from "@lib/store/settings-atom";
import { isSettingsOpen } from "@lib/store/ui-atoms";
import { clsx, normalizeThemeName } from "@lib/utilities";
import { Monaco, useMonaco } from "@monaco-editor/react";
import { atom, useAtom, useAtomValue } from "jotai";
import React, { Fragment, Suspense, useMemo } from "react";
import { Instance, loadTheme } from "../editor/monaco.helpers";
import Select from "../shared/Select";
import Toggle from "../shared/Toggle";

interface SettingsModalProps {}

const SettingsModal: React.FC<SettingsModalProps> = () => {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpen);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform  rounded-2xl bg-dark-700 p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium my-0 text-gray-200"
                  >
                    App Settings
                  </Dialog.Title>

                  <SettingsTabs />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

interface SettingsOptionProps {
  onChange: () => void;
  label: string;
  value: any;
}

const SettingsToggle: React.FC<SettingsOptionProps> = ({
  onChange,
  label,
  value,
}) => {
  return (
    <div className="py-1 border-y-1 flex col-span-1 items-center gap-2 border-dark-600">
      <label className="text-true-gray-400  text-sm">{label}</label>
      <Toggle enabled={value} label={label} onChange={onChange} />
    </div>
  );
};

const ThemePicker: React.FC = () => {
  const themes = useAtomValue(themeAtom);
  const [{ editor }, setSelected] = useAtom(settings);

  const monacoInstance = useMonaco();

  const handleChange = async (val: { label: string; value: string }) => {
    if (!monacoInstance?.editor) return;

    const theme = await loadTheme(val);

    const name = normalizeThemeName(val.value);

    monacoInstance.editor.defineTheme(name, theme);
    monacoInstance.editor.setTheme(name);

    setSelected((p) => ({ ...p, editor: { ...p.editor, currentTheme: val } }));
  };

  return (
    <Select
      data={themes}
      onChange={handleChange}
      active={editor.currentTheme}
    />
  );
};

const CursorPicker: React.FC = () => {
  const cursors = [
    { label: "Blink", value: "block" },
    { label: "Block outline", value: "block-outline" },
    { label: "Line", value: "line" },
    { label: "Line thin", value: "line-thin" },
    { label: "Underline", value: "underline" },
    { label: "Underline thin", value: "underline-thin" },
  ];

  const [{ editor }, setSettings] = useAtom(settings);

  const handleChange = async (val: { label: string; value: string }) => {
    setSettings((p) => ({ ...p, editor: { ...p.editor, cursorStyle: val } }));
  };

  return (
    <Select
      data={cursors}
      onChange={handleChange}
      active={editor.cursorStyle}
    />
  );
};

const SettingsTabs: React.FC = () => {
  const headers = useMemo(() => ["Editor", "Document", "Support"], []);

  const [{ editor }, setSettings] = useAtom(settings);

  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className={"mt-3 w-full flex"}>
        {headers.map((el) => (
          <Tab
            className={({ selected }) =>
              clsx(
                "px-3 py-1 w-full text-sm border-b font-medium",
                selected
                  ? "border-b-cyan-500 text-cyan-500"
                  : "border-dark-400 text-true-gray-500"
              )
            }
            key={el}
          >
            {el}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className={"text-true-gray-400 pt-3"}>
        <Tab.Panel className={"grid grid-cols-2"}>
          <Suspense
            fallback={
              <div className="w-full h-30 col-span-2 rounded-lg bg-dark-300 animate-skeleton" />
            }
          >
            <SettingsToggle
              value={editor.wordWrap}
              label="Enable Word wrap "
              onChange={() =>
                setSettings((p) => ({
                  ...p,
                  editor: {
                    ...p.editor,
                    wordWrap: !p.editor.wordWrap,
                  },
                }))
              }
            />
            <SettingsToggle
              value={editor.scrollSync}
              label="Enable scroll sync"
              onChange={() =>
                setSettings((p) => ({
                  ...p,
                  ...p.editor,
                  scrollSync: !p.editor.scrollSync,
                }))
              }
            />
            <div className="py-1 border-y-1  col-span-2 flex items-center gap-2 border-dark-600">
              <label className="text-true-gray-400  text-sm">
                {"Editor Theme"}
              </label>
              <ThemePicker />
            </div>
            <div className="py-1 border-y-1  col-span-2 flex items-center gap-2 border-dark-600">
              <label className="text-true-gray-400  text-sm">
                {"Editor Cursor"}
              </label>
              <CursorPicker />
            </div>
          </Suspense>
        </Tab.Panel>

        <Tab.Panel className={"grid grid-cols-2"}>
          <p className="text-sm text-true-gray-500 col-span-2">
            Options for document settings
          </p>
        </Tab.Panel>
        <Tab.Panel className={"grid grid-cols-2"}>
          <p className="text-sm text-true-gray-500 col-span-2">
            This app is still in Beta, I am a single developer working on this.
            <br /> Please be patient 🙂
          </p>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default SettingsModal;
