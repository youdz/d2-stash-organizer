import { render } from "preact";
import "./App.css";
import { GitHubLink } from "./GitHubLink";
import { CollectionProvider } from "./store/CollectionContext";
import { SelectionProvider } from "./transfer/SelectionContext";
import { Routes } from "./routing/Routes";

export function App() {
  return (
    // Need a root div to properly replace the loading text.
    <div id="app">
      <SelectionProvider>
        <CollectionProvider>
          <GitHubLink />
          <h1>Diablo 2 Item Manager</h1>
          {/* TODO: Help section */}
          {/* TODO: Ethical analytics */}
          <Routes />
        </CollectionProvider>
      </SelectionProvider>
    </div>
  );
}

render(<App />, document.body, document.getElementById("app")!);
