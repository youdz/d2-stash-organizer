import { PlugyPage } from "../../../scripts/plugy-stash/types";
import { D2rPage } from "../../../scripts/d2r-stash/types";

const DEFAULT_PERSONAL_NAME = "Personal Page #";
const DEFAULT_SHARED_NAME = "Shared Page #";

export function pageName(page: PlugyPage | D2rPage) {
  if ("name" in page) {
    return (
      page.name ||
      (typeof page.flags !== "undefined" && page.flags % 2
        ? DEFAULT_SHARED_NAME
        : DEFAULT_PERSONAL_NAME)
    );
  } else {
    return DEFAULT_SHARED_NAME;
  }
}
