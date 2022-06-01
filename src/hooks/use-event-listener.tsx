import { ChangeEvent, useEffect } from "react";
import { isSSR } from "./use-isomorphic-effect";

type Target = typeof window | HTMLElement | typeof document;

export const useEventListener = <T,>(
  name: keyof WindowEventMap,
  handler: (e: T) => void,
  target?: Target
) => {
  useEffect(() => {
    const _target = target || window;
    // @ts-expect-error
    _target.addEventListener(name, handler, { capture: true });
    return () => {
      // @ts-expect-error
      _target.removeEventListener(name, handler, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
};
