import {
  isStash,
  ItemsOwner,
  SHARED_STASH_NAME,
} from "../../scripts/save-file/ownership";

export function PrettyOwnerName({ owner }: { owner: ItemsOwner }) {
  if (isStash(owner)) {
    if (owner.personal) {
      return (
        <>
          <span class="unique">{owner.filename.slice(0, -4)}</span>'s stash
        </>
      );
    } else {
      return <span class="magic">{SHARED_STASH_NAME}</span>;
    }
  } else {
    return <span class="unique">{owner.filename.slice(0, -4)}</span>;
  }
}
