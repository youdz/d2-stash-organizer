import { RenderableProps } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { GrailTracker } from "../grail/GrailTracker";
import { StashView } from "../stash/StashView";
import "./Navigation.css";
import { Organizer } from "../organizer/Organizer";
import { Collection } from "../collection/Collection";

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

  useEffect(() => {
    const listener = () => setCurrentHash(location.hash);
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);

  const view = useMemo(() => {
    switch (currentHash) {
      case "#stash":
        return <StashView />;
      case "#organize":
        return <Organizer />;
      case "#grail-tracker":
        return <GrailTracker />;
      default:
        return <Collection />;
    }
  }, [currentHash]);
  return (
    <>
      <nav id="navigation">
        <NavLink hash="#collection" isHome>
          My collection
        </NavLink>
        <NavLink hash="#stash">My stashes</NavLink>
        <NavLink hash="#organize">Organize</NavLink>
        <NavLink hash="#grail-tracker">Grail tracker</NavLink>
      </nav>
      {view}
    </>
  );
}
