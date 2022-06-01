import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CommandPallete } from "src/components/command-pallete";
import Sidebar from "../components/sidebar";
import { SplitLayout } from "../components/split-layout";

const Preview = dynamic<{}>(() => import("../components/preview"), {
  ssr: false,
});

const Editor = dynamic<{}>(() => import("../components/editor"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <section className="w-full flex bg-dark-900">
      <CommandPallete />
      <Sidebar />
      <SplitLayout.Root>
        <SplitLayout.Pane id="editor">
          <Editor />
        </SplitLayout.Pane>

        <SplitLayout.Pane id="preview">
          <Preview />
        </SplitLayout.Pane>
      </SplitLayout.Root>
    </section>
  );
};

export default Home;
