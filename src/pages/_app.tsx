import { Provider as JotaiProvider } from "jotai";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";
import { Toaster } from "react-hot-toast";
import { EditorProvider } from "src/hooks/use-editor";
import "windi.css";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Marked UP</title>
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="black"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="author" content="Sidharth Rathi" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="notranslate" />
        <meta name="googlebot" content="index, follow" />
        <meta name="otherbot" content="index, follow" />
        <meta name="google" content="nopagereadaloud" />
        <meta name="copyright" content="Sidharth Rathi" />
        <meta name="Classification" content="Web application" />
        <meta name="designer" content="Sidharth Rathi" />
        <meta name="owner" content="Sidharth Rathi" />
        <meta
          name="description"
          content="A better, feature rich README editor and generator"
        />
      </Head>
      <JotaiProvider>
        <EditorProvider>
          <Component {...pageProps} />
        </EditorProvider>
        <Toaster />
      </JotaiProvider>
    </Fragment>
  );
}

export default MyApp;
