import { Stash } from "../../scripts/stash/types";
import { parseStash } from "../../scripts/stash/parsing/parseStash";
import { generateSaveFile } from "../../scripts/stash/parsing/generateSaveFile";

const DEFAULT_SHARED_FILENAME = "_LOD_SharedStashSave.sss";
const DEFAULT_PERSONAL_FILENAME = "CharacterName.d2x";

if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. " +
      "This application will not remember your stash between sessions."
  );
}

const STORE = "stash";
const DB = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open("D2StashOrganizer");
  request.onerror = function () {
    reject("Unable to open IndexedDB");
  };
  request.onsuccess = function () {
    resolve(this.result);
  };
  request.onupgradeneeded = function () {
    const storeCreation = this.result.createObjectStore(STORE);
    const oldSave = localStorage.getItem("stash");
    if (oldSave) {
      storeCreation.transaction.oncomplete = () => {
        // Small code duplication, but this is just legacy support that will go away
        this.result
          .transaction(STORE, "readwrite")
          .objectStore(STORE)
          .put(stashToFile(JSON.parse(oldSave)), 0);
      };
    }
  };
});

function readStashFile() {
  return DB.then(
    (db) =>
      new Promise<File>((resolve, reject) => {
        const request = db
          .transaction(STORE, "readonly")
          .objectStore(STORE)
          .get(0);
        request.onerror = function () {
          reject("Unable to read stash.");
        };
        request.onsuccess = function () {
          resolve(this.result);
        };
      })
  );
}

export function writeStashFile(stash: File) {
  return DB.then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const request = db
          .transaction(STORE, "readwrite")
          .objectStore(STORE)
          .put(stash, 0);
        request.onerror = function () {
          reject("Unable to save stash.");
        };
        request.onsuccess = function () {
          resolve();
        };
      })
  );
}

export async function stashFromFile(file: File) {
  try {
    const stash = parseStash(new Uint8Array(await file.arrayBuffer()));
    stash.filename = file.name;
    return stash;
  } catch (e) {
    if (e instanceof Error) {
      alert(e.message);
    }
    throw e;
  }
}

export function stashToFile(stash: Stash) {
  return new File(
    [new Blob([generateSaveFile(stash).buffer])],
    stash.filename ||
      (stash.personal ? DEFAULT_PERSONAL_FILENAME : DEFAULT_SHARED_FILENAME)
  );
}

export async function getSavedStash() {
  const file = await readStashFile();
  if (file) {
    return stashFromFile(file);
  }
}

export function downloadStash(file: File) {
  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(file);
  elem.download = file.name;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
