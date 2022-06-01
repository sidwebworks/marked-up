import { atom } from "jotai";

function createToggleAtom(defaultValue: boolean = false) {
  const self = atom(defaultValue, (get, set, next) => {
    const update = next ?? !get(self);
    set(self, update);
  });

  return self;
}

export const isSettingsOpen = createToggleAtom(false);

export const isPreviewOpen = createToggleAtom(true);

export const isCommandPalleteOpen = createToggleAtom(false);
