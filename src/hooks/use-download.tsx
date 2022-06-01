import { useCallback } from "react";

export const useDownload = () => {
  //   Callback to use inside the component
  const execute = useCallback((filename: string, content: string) => {
    const element = document.createElement("a");

    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8, " + encodeURIComponent(content)
    );

    element.setAttribute("download", filename);

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  return execute;
};
