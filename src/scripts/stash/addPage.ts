import { PageFlags, Stash } from "./types";

export function addPage(stash: Stash, pageName: string) {
  const page = {
    name: `# ${pageName}`,
    items: [],
    flags: stash.personal ? PageFlags.NONE : PageFlags.SHARED,
  };
  stash.pages.push(page);
  return page;
}
