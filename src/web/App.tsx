import { render, RenderableProps } from "preact";
import "./App.css";
import { GitHubLink } from "./GitHubLink";
import { CollectionProvider } from "./store/CollectionContext";
import { SelectionProvider } from "./transfer/SelectionContext";
import { Routes } from "./routing/Routes";
import { HelpLink } from "./help/HelpLink";
import { SettingsContext, SettingsProvider } from "./settings/SettingsContext";
import { useContext } from "preact/hooks";

function Providers({ children }: RenderableProps<unknown>) {
  return (
    <SettingsProvider>
      <SelectionProvider>
        <CollectionProvider>{children}</CollectionProvider>
      </SelectionProvider>
    </SettingsProvider>
  );
}

function App() {
  const { accessibleFont } = useContext(SettingsContext);

  return (
    // Need a root div to properly replace the loading text.
    <div id="app" class={accessibleFont ? "accessible-font" : ""}>
      <GitHubLink />
      <HelpLink />
      <h1>Diablo 2 Collection Manager</h1>
      <Routes />
    </div>
  );
}

render(
  <Providers>
    <App />
  </Providers>,
  document.body,
  document.getElementById("app")!
);
