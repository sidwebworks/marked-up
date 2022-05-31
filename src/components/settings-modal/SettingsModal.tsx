import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { settings, themeAtom } from "@lib/store/settings-atom";
import { isSettingsOpen } from "@lib/store/ui-atoms";
import { clsx } from "@lib/utilities";
import { useMonaco } from "@monaco-editor/react";
import { useAtom, useAtomValue } from "jotai";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import { loadTheme, normalizeThemeName } from "../editor/monaco.helpers";
import Toggle from "../shared/Toggle";

interface SettingsModalProps {}

const SettingsModal: React.FC<SettingsModalProps> = () => {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpen);

  const [{ scrollSync }, setSettings] = useAtom(settings);

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
                    className="text-lg font-medium  my-0 text-gray-200"
                  >
                    Settings
                  </Dialog.Title>
                  <p className="text-sm mt-1 text-true-gray-500">
                    This app is still in Beta, I am a single developer working
                    on this.
                  </p>

                  <div className="mt-4 grid grid-cols-2 ">
                    <SettingsToggle
                      value={scrollSync}
                      label="Enable scroll sync"
                      onChange={() =>
                        setSettings((p) => ({
                          ...p,
                          scrollSync: !p.scrollSync,
                        }))
                      }
                    />
                    <div className="py-1 border-y-1  col-span-2 flex items-center gap-2 border-dark-600">
                      <label className="text-true-gray-400  text-sm">
                        {"Editor Theme"}
                      </label>
                      <Suspense
                        fallback={
                          <div className="w-full h-10 rounded-md col-span-2 max-w-1/2 animate-duration-[5s] bg-dark-300 animate-loop animate-flash " />
                        }
                      >
                        <ThemePicker />
                      </Suspense>
                    </div>
                  </div>
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

type ThemePickerProps = {};

const ThemePicker: React.FC<ThemePickerProps> = () => {
  const themes = useAtomValue(themeAtom);
  const [{ currentTheme }, setSelected] = useAtom(settings);
  const monacoInstance = useMonaco();

  const handleChange = async (val: string) => {
    if (!monacoInstance?.editor) return;

    const theme = await loadTheme(val);

    const name = normalizeThemeName(val);

    monacoInstance.editor.defineTheme(name, theme);
    monacoInstance.editor.setTheme(name);

    setSelected((p) => ({ ...p, currentTheme: val }));
  };

  return (
    <Listbox value={currentTheme} onChange={handleChange}>
      <div className="relative mt-1 w-full max-w-56">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-dark-300 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focusable  sm:text-sm">
          <span className="block truncate text-cyan-500">{currentTheme}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-true-gray-500"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark-400 py-1 text-base shadow-lg ring-1 focusable sm:text-sm">
            {Object.entries(themes).map(([theme, value]) => (
              <Listbox.Option
                key={theme}
                className={({ active }) =>
                  clsx(
                    "relative cursor-pointer select-none py-2 pl-10 pr-4 ",
                    active
                      ? "bg-dark-300 transition text-cyan-500"
                      : "text-true-gray-200"
                  )
                }
                value={value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium text-cyan-500" : "font-normal"
                      }`}
                    >
                      {value as string}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default SettingsModal;
