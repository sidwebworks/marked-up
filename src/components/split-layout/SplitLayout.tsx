import React, { FC, Fragment, PropsWithChildren, ReactNode } from "react";
import SplitPane from "react-split-pane";
import { useWindowDimensions } from "../../hooks/use-window-dimensions";

interface SplitLayoutProps {
  children: ReactNode;
}

export const Root: React.FC<SplitLayoutProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  return (
    <div className="flex w-full overflow-auto items-center top-0 h-screen relative">
      {/* @ts-expect-error */}
      <SplitPane
        split="vertical"
        size={width / 2}
        maxSize={width - width / 3}
        minSize={width / 3}
        primary={"first"}
        paneStyle={{ overflow: "auto" }}
        className={"!h-full bg-dark-500 top-0"}
      >
        {children}
      </SplitPane>
    </div>
  );
};

export const Pane: FC<PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  return (
    <div id={id} className="bg-dark-800 w-full overflow-auto h-full">
      {children}
    </div>
  );
};
