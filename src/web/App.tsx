import { render } from "preact";
import "./App.css";
import "./Controls.css";
import { GitHubLink } from "./GitHubLink";
import { FilePicker } from "./store/FilePicker";
import { StashProvider } from "./store/stashContext";
import { Routes } from "./routing/Routes";

export function App() {
  return (
    // Need a root div to properly replace the loading text.
    <div id="app">
      <StashProvider>
        <GitHubLink />
        <h1>
          Diablo 2 PlugY Stash Organizer
          <FilePicker />
        </h1>
        <Routes />
      </StashProvider>
    </div>
  );
}

render(<App />, document.body, document.getElementById("app")!);
