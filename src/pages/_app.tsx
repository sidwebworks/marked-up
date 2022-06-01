import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import "windi.css";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <Toaster />
      <Component {...pageProps} />
    </JotaiProvider>
  );
}

export default MyApp;
