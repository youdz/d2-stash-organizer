import { Stash } from "../../scripts/stash/types";
import { grailSummary } from "../../scripts/grail/list/grailProgress";
import { useMemo } from "preact/hooks";

export interface GrailSummaryProps {
  stash: Stash;
}

export function GrailSummary({ stash }: GrailSummaryProps) {
  const { nbNormal, totalNormal, nbEth, totalEth, nbPerfect } = useMemo(
    () => grailSummary(stash),
    [stash]
  );

  return (
    <>
      <p>
        Normal Grail: {nbNormal} / {totalNormal}
      </p>
      <p>
        Eth Grail: {nbEth} / {totalEth}
      </p>
      <p>
        Perfect Grail: {nbPerfect} / {totalNormal}
      </p>
    </>
  );
}
