import { parseSaveFile, toSaveFile } from "./parser";

if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. " +
      "This application will not remember your stash between sessions."
  );
}

const OLD_STORE = "stash";
const STORE = "save_files";
const STORE_VERSION = 2;
const DB = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open("D2StashOrganizer", STORE_VERSION);
  let backfill: Promise<void> | undefined;
  request.onerror = function () {
    reject("Unable to open IndexedDB");
  };
  request.onsuccess = function () {
    if (backfill) {
      backfill.finally(() => resolve(this.result));
    } else {
      resolve(this.result);
    }
  };
  request.onupgradeneeded = function (e) {
    const db = this.result;
    const storeCreation = db.createObjectStore(STORE, {
      keyPath: "name",
    });
    if (e.oldVersion < 1) {
      // Port the stash that was stored as JSON in local storage
      const oldSave = localStorage.getItem("stash");
      if (oldSave) {
        storeCreation.transaction.oncomplete = () => {
          // Small code duplication, but this is just legacy support that will go away
          db.transaction(STORE, "readwrite")
            .objectStore(STORE)
            .add(toSaveFile(JSON.parse(oldSave)));
        };
      }
    } else if (e.oldVersion < 2) {
      // Port the only stash that was stored in the previous store
      backfill = new Promise<void>((resolve, reject) => {
        const v1Data = request.transaction!.objectStore(OLD_STORE).get(0);
        v1Data.onsuccess = function () {
          if (this.result) {
            const adding = request
              .transaction!.objectStore(STORE)
              .add(this.result);
            adding.onsuccess = () => resolve();
            adding.onerror = () => reject();
          } else {
            resolve();
          }
        };
        v1Data.onerror = () => reject();
      });
    }
  };
});

export function readSaveFiles() {
  return DB.then(
    (db) =>
      new Promise<File[]>((resolve, reject) => {
        const request = db
          .transaction(STORE, "readonly")
          .objectStore(STORE)
          .getAll();
        request.onerror = function () {
          reject("Unable to read save files.");
        };
        request.onsuccess = function () {
          resolve(this.result);
        };
      })
  );
}

export function writeSaveFile(stash: File) {
  return DB.then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const request = db
          .transaction(STORE, "readwrite")
          .objectStore(STORE)
          .put(stash);
        request.onerror = function () {
          reject("Unable to store save file.");
        };
        request.onsuccess = function () {
          resolve();
        };
      })
  );
}

export function writeAllFiles(files: File[]) {
  return DB.then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE, "readwrite");
        const objectStore = transaction.objectStore(STORE);
        objectStore.clear();
        for (const file of files) {
          objectStore.add(file);
        }
        transaction.onerror = function () {
          reject("Unable to store save files.");
        };
        transaction.oncomplete = function () {
          resolve();
        };
      })
  );
}

export async function getSavedStashes() {
  const files = await readSaveFiles();
  return files.map((file) => parseSaveFile(file));
}
