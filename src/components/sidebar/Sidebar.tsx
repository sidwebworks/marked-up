import {
  CogIcon,
  DownloadIcon,
  MenuIcon,
  PuzzleIcon,
} from "@heroicons/react/outline";
import { codeAtom } from "@lib/store/editor-atoms";
import { isSettingsOpen } from "@lib/store/ui-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import React, { ComponentType, FC, Fragment } from "react";
import { useDownload } from "src/hooks/use-download";
import { SettingsModal } from "../settings-modal";

interface SidebarProps {}

const SidebarButton: FC<{
  icon: ComponentType<any>;
  onClick?: () => void;
}> = ({ icon: Icon, onClick = () => {} }) => {
  return (
    <button
      onClick={onClick}
      className="p-3.5 m-0.5 center bg-dark-800 focusable active:scale-95 transform hover:bg-dark-600 text-cyan-400 stroke-current"
    >
      <Icon strokeWidth={1.3} className="w-6 h-6 " />
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = () => {
  const toggleSettings = useSetAtom(isSettingsOpen);
  const code = useAtomValue(codeAtom);

  const handleDownload = useDownload();
  

  return (
    <Fragment>
      <aside className="pb-4  left-0 top-0 border-r-2 border-r-dark-500 z-10 h-screen bg-dark-800  flex-col justify-between flex relative items-center">
        <SidebarButton icon={MenuIcon} />
        <div className="flex-col justify-center ">
          <SidebarButton icon={PuzzleIcon} />
          <SidebarButton onClick={() => toggleSettings(true)} icon={CogIcon} />
          <SidebarButton
            icon={DownloadIcon}
            onClick={() => handleDownload("README.md", code)}
          />
        </div>
      </aside>
      <SettingsModal />
    </Fragment>
  );
};

export default Sidebar;
