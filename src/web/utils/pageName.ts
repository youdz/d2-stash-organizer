import { Page } from "../../scripts/stash/types";

const DEFAULT_PERSONAL_NAME = "Personal Page #";
const DEFAULT_SHARED_NAME = "Shared Page #";

export function pageName(page: Page) {
  return (
    page.name ||
    (typeof page.flags !== "undefined" && page.flags % 2
      ? DEFAULT_SHARED_NAME
      : DEFAULT_PERSONAL_NAME)
  );
}
