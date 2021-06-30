import { grailSummary } from "../../scripts/grail/list/grailProgress";
import { useContext, useMemo } from "preact/hooks";
import { StashContext } from "../store/stashContext";

export function GrailSummary() {
  const { stash } = useContext(StashContext);

  const { nbNormal, totalNormal, nbEth, totalEth, nbPerfect } = useMemo(
    () => grailSummary(stash),
    [stash]
  );

  return (
    <div>
      <p>
        Normal Grail: {nbNormal} / {totalNormal}
      </p>
      <p>
        Eth Grail: {nbEth} / {totalEth}
      </p>
      <p>
        Perfect Grail: {nbPerfect} / {totalNormal}
      </p>
    </div>
  );
}
