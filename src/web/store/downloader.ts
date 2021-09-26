import { downloadZip } from "client-zip";

export function downloadFile(file: Blob, fileName: string) {
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
  downloadFile(blob, "D2Save.zip");
}
