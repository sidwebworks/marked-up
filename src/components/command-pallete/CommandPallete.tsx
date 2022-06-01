import { Combobox, Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import { isCommandPalleteOpen } from "@lib/store/ui-atoms";
import { clsx } from "@lib/utilities";
import { useAtom } from "jotai";
import React, { Fragment, useMemo, useState } from "react";
import { useEventListener } from "src/hooks/use-event-listener";

interface CommandPalleteProps {}

const ACTIONS = ["Documents", "Support"];

const CommandPallete: React.FC<CommandPalleteProps> = () => {
  const [isOpen, setIsOpen] = useAtom(isCommandPalleteOpen);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");

  useEventListener<KeyboardEvent>("keydown", (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      setIsOpen();
    }
  });

  const items = useMemo(() => {
    return ACTIONS.filter((action) =>
      action.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <Transition.Root show={isOpen} appear as={Fragment}>
      <Dialog
        onClose={setIsOpen}
        className="fixed inset-0 z-10 p-4 top-[25vh] overflow-y-auto"
      >
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay
            className={"bg-dark-900 opacity-60 blur-2xl fixed inset-0"}
          />
        </Transition.Child>

        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            value={selected}
            onChange={setSelected}
            as="div"
            className="p-1 mx-auto max-w-xl shadow-lg rounded-lg bg-dark-800 relative z-10"
          >
            <div className=" flex border-b border-b-dark-500 items-center px-3.5 py-1.5  rounded-md rounded-b-none">
              <SearchIcon className="w-6 h-6 text-cyan-500" />
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(item: string) => item}
                className="w-full  border-none  text-true-gray-300 caret-cyan-500 placeholder-true-gray-600 bg-transparent focus:outline-none focus:ring-0"
                placeholder="Search"
              />
            </div>
            <Combobox.Options
              static
              className="w-full flex px-3 list-none bg-dark-800 rounded-b-md divide-dark-400 flex-col"
            >
              {items.map((action) => (
                <Combobox.Option value={action} key={action}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        "px-3 py-3 cursor-pointer rounded-md my-0.5",
                        active
                          ? "text-cyan-400 bg-dark-700"
                          : "text-true-gray-300"
                      )}
                    >
                      {action}
                    </div>
                  )}
                </Combobox.Option>
              ))}
              {!items.length ? (
                <div className="py-2 px-3 text-center text-lg  text-true-gray-400">
                  No Results found
                </div>
              ) : (
                <></>
              )}
            </Combobox.Options>
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default CommandPallete;
