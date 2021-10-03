import { PageFlags, PlugyStash } from "./types";

export function addPage(stash: PlugyStash, pageName: string, index?: number) {
  const page = {
    name: `# ${pageName}`,
    items: [],
    flags: stash.personal ? PageFlags.NONE : PageFlags.SHARED,
  };
  if (typeof index === "undefined") {
    stash.pages.push(page);
  } else {
    stash.pages.splice(index, 0, page);
  }
  return page;
}
