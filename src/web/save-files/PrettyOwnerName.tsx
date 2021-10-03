import {
  D2R_SHARED_STASH_NAME,
  isCharacter,
  isPlugyStash,
  ItemsOwner,
  NON_PLUGY_SHARED_STASH_NAME,
  PLUGY_SHARED_STASH_NAME,
} from "../../scripts/save-file/ownership";

export function PrettyOwnerName({ owner }: { owner: ItemsOwner }) {
  if (isPlugyStash(owner)) {
    if (owner.personal) {
      return (
        <>
          <span class="unique">{owner.filename.slice(0, -4)}</span>'s stash
        </>
      );
    } else {
      return (
        <span class="magic">
          {owner.nonPlugY
            ? NON_PLUGY_SHARED_STASH_NAME
            : PLUGY_SHARED_STASH_NAME}
        </span>
      );
    }
  } else if (isCharacter(owner)) {
    return <span class="unique">{owner.filename.slice(0, -4)}</span>;
  } else {
    return <span class="magic">{D2R_SHARED_STASH_NAME}</span>;
  }
}
