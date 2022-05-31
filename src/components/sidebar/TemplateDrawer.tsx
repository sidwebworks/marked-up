import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useAtom } from "jotai";
import {
  Dispatch,
  SetStateAction,
  Fragment,
  FC,
  forwardRef,
  ComponentPropsWithRef,
} from "react";
import { arrayMove, List } from "react-movable";
import { Template, templatesAtom } from "../../lib/store/ui-atoms";

interface TemplateDrawerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TemplateDrawer: React.FC<TemplateDrawerProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [templates, setTemplates] = useAtom(templatesAtom);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark-800 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300  focusable"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-dark-600 py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-2xl font-medium text-gray-200">
                        Select a section template
                      </Dialog.Title>
                    </div>
                    <div className="relative m-4 p-2 border-2 border-dashed border-dark-200 flex-1 ">
                      <List
                        values={templates}
                        onChange={({ oldIndex, newIndex }) =>
                          setTemplates(arrayMove(templates, oldIndex, newIndex))
                        }
                        renderList={({ children, props }) => (
                          <ul {...props} className="space-y-2">
                            {children}
                          </ul>
                        )}
                        renderItem={({ value, props }) => (
                          <TemplateItem
                            code={value.code}
                            name={value.name}
                            {...props}
                          />
                        )}
                      />

                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const TemplateItem: FC<ComponentPropsWithRef<"li"> & Template> = forwardRef(
  ({ code, name, ...props }, ref) => {
    return (
      <li
        ref={ref}
        {...props}
        className="p-3  relative z-10 list-none rounded-md text-cyan-400 rounded-md bg-dark-400"
      >
        {name}
      </li>
    );
  }
);

TemplateItem.displayName = "TemplateItem";

export default TemplateDrawer;
