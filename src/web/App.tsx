import { render } from "preact";
import "./App.css";
import { GitHubLink } from "./GitHubLink";
import { FilePicker } from "./store/FilePicker";
import { CollectionProvider } from "./store/CollectionContext";
import { Routes } from "./routing/Routes";

export function App() {
  return (
    // Need a root div to properly replace the loading text.
    <div id="app">
      <CollectionProvider>
        <GitHubLink />
        <h1>
          Diablo 2 Item Manager
          {/* TODO: move out of the title */}
          <FilePicker />
        </h1>
        <Routes />
      </CollectionProvider>
    </div>
  );
}

render(<App />, document.body, document.getElementById("app")!);
