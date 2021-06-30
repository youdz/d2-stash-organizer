import { createContext, RenderableProps } from "preact";
import { Stash } from "../../scripts/stash/types";
import { useEffect, useMemo, useState } from "preact/hooks";
import { getSavedStash } from "./store";

export interface StashContextValue {
  stash: Stash | undefined;
  setStash: (stash: Stash) => void;
}

export const StashContext = createContext<StashContextValue>({
  stash: undefined,
  setStash: () => undefined,
});

export function StashProvider({ children }: RenderableProps<unknown>) {
  const [stash, setStash] = useState<Stash | undefined>(undefined);
  const value = useMemo(() => ({ stash, setStash }), [stash]);

  // Initialize with the stash found in storage
  useEffect(() => {
    getSavedStash()
      .then((stash) => setStash(stash))
      .catch(() => undefined);
  }, []);

  return (
    <StashContext.Provider value={value}>{children}</StashContext.Provider>
  );
}
