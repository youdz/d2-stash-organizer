import { downloadZip } from "client-zip";

export function downloadStash(file: Blob, fileName: string) {
  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(file);
  elem.download = fileName;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
  window.URL.revokeObjectURL(elem.href);
}

export async function downloadAllFiles(files: File[]) {
  const blob = await downloadZip(files).blob();
  downloadStash(blob, "D2Save.zip");
}
