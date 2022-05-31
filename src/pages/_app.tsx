import "windi.css";
import "../styles/global.css";
import { Provider as JotaiProvider } from "jotai";

import type { AppProps } from "next/app";
import { Suspense } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <Suspense fallback="Loading...">
        <Component {...pageProps} />
      </Suspense>
    </JotaiProvider>
  );
}

export default MyApp;
