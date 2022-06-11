import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { EditorProvider } from "src/hooks/use-editor";
import "windi.css";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <EditorProvider>
        <Component {...pageProps} />
      </EditorProvider>
      <Toaster />
    </JotaiProvider>
  );
}

export default MyApp;
