import { PlugyPage, PageFlags } from "./types";

export function makeIndex(page: PlugyPage, main?: boolean) {
  if (typeof page.flags === "undefined") {
    return;
  }
  page.flags += PageFlags.INDEX;
  if (main) {
    page.flags += PageFlags.MAIN_INDEX;
  }
}
