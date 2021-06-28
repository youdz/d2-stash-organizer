import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getSavedStash } from "./utils/store";
import "./App.css";
import { Actions } from "./Actions";
import { Stash } from "../scripts/stash/types";
import { GitHubLink } from "./GitHubLink";
import { GrailTracker } from "./grail/GrailTracker";
import { StashView } from "./stash/StashView";

export function App() {
  const [stash, setStash] = useState<Stash | undefined>(undefined);
  const [filter, setFilter] = useState("");
  const [grailTracker, setGrailTracker] = useState(
    () => window.location.hash === "#grail-tracker"
  );

  useEffect(() => {
    getSavedStash()
      .then((stash) => setStash(stash))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const listener = () => setGrailTracker(location.hash === "#grail-tracker");
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);

  return (
    <div>
      <GitHubLink />
      <h1>Diablo 2 PlugY Stash Organizer</h1>
      <Actions
        grailTracker={grailTracker}
        stash={stash}
        onStashChange={setStash}
        filter={filter}
        setFilter={setFilter}
      />

      {grailTracker && stash && <GrailTracker stash={stash} />}

      {!grailTracker && <StashView stash={stash} filter={filter} />}
    </div>
  );
}

render(<App />, document.body, document.getElementById("container")!);
