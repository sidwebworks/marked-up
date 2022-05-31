import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Sidebar from "../components/sidebar";
import { SplitLayout } from "../components/split-layout";

const Preview = dynamic<{}>(
  () => import("../components/preview").then((m) => m.Preview),
  { ssr: false }
);

const Editor = dynamic<{}>(
  () => import("../components/editor").then((m) => m.Editor),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <section className="w-full flex bg-dark-800">
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
