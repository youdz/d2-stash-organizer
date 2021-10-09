import { createContext, RenderableProps } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";

interface SettingsContext {
  accessibleFont: boolean;
  toggleAccessibleFont: () => void;
}

export const SettingsContext = createContext<SettingsContext>({
  accessibleFont: false,
  toggleAccessibleFont: () => undefined,
});

export function SettingsProvider({ children }: RenderableProps<unknown>) {
  const [accessibleFont, setAccessibleFont] = useState(
    () => localStorage.getItem("accessibleFont") === "true"
  );

  const toggleAccessibleFont = useCallback(() => {
    setAccessibleFont((previous) => {
      localStorage.setItem("accessibleFont", `${!previous}`);
      return !previous;
    });
  }, []);

  const value = useMemo(
    () => ({
      accessibleFont,
      toggleAccessibleFont,
    }),
    [accessibleFont, toggleAccessibleFont]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
