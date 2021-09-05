import { RenderableProps } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { GrailTracker } from "../grail/GrailTracker";
import { StashView } from "../stash/StashView";
import "./Navigation.css";
import { Organizer } from "../organizer/Organizer";
import { Collection } from "../collection/Collection";
import { SaveFiles } from "../save-files/SaveFiles";
import { CollectionContext } from "../store/CollectionContext";

function NavLink({
  hash,
  isHome,
  children,
}: RenderableProps<{ hash: string; isHome?: boolean }>) {
  const isActive = location.hash === hash || (isHome && location.hash === "");
  return (
    <a class={isActive ? "nav-link active" : "nav-link"} href={hash}>
      {children}
    </a>
  );
}

export function Routes() {
  const [currentHash, setCurrentHash] = useState(location.hash);
  const { characters } = useContext(CollectionContext);

  useEffect(() => {
    const listener = () => setCurrentHash(location.hash);
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);

  const view = useMemo(() => {
    switch (currentHash) {
      case "#collection":
        return <Collection />;
      case "#stash":
        return <StashView />;
      case "#organize":
        return <Organizer />;
      case "#grail-tracker":
        return <GrailTracker />;
      default:
        return <SaveFiles />;
    }
  }, [currentHash]);
  return (
    <>
      <nav id="navigation">
        <NavLink hash="#saves" isHome>
          Save files
        </NavLink>
        <NavLink hash="#collection">Collection</NavLink>
        <NavLink hash="#stash">Stashes</NavLink>
        <NavLink hash="#organize">Organize</NavLink>
        <NavLink hash="#grail-tracker">Grail tracker</NavLink>
      </nav>
      {view}
    </>
  );
}
