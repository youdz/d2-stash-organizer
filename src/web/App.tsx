import { render } from "preact";
import { useCallback, useState } from "preact/hooks";
import { getStash, saveStash } from "./stash";
import "./App.css";
import { Pages } from "./Pages";
import { Actions } from "./Actions";
import { organize } from "../scripts/grail/organize";

export function App() {
  const [stash, setStash] = useState(() => getStash());

  const handleOrganize = useCallback(() => {
    if (stash) {
      organize(stash);
      const clone = { ...stash };
      // TODO: none of local storage is handled right now
      // saveStash(clone);
      setStash(clone);
    }
  }, [stash]);

  return (
    <div>
      <h1>Diablo 2 Plugy Stash Organizer</h1>
      <Actions
        stash={stash}
        onSaveFileChange={setStash}
        onOrganize={handleOrganize}
      />
      {stash && <Pages pages={stash.pages} />}
    </div>
  );
}

render(<App />, document.body, document.getElementById("container")!);
