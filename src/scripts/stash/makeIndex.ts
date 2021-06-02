import { Page, PageFlags } from "./types";

export function makeIndex(page: Page, main?: boolean) {
  page.flags = PageFlags.SHARED + PageFlags.INDEX;
  if (main) {
    page.flags += PageFlags.MAIN_INDEX;
  }
}
