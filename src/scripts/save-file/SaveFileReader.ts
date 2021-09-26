import { indexOf } from "../stash/parsing/indexOf";

export class SaveFileReader {
  constructor(private raw: Uint8Array) {
    this.dataView = new DataView(this.raw.buffer);
  }

  private dataView: DataView;

  public peek = false;
  public nextIndex = 0;

  private moveTo(newIndex: number) {
    if (!this.peek) {
      this.nextIndex = newIndex;
    }
  }

  get done() {
    return this.nextIndex >= this.raw.length;
  }

  read(length: number, position = this.nextIndex) {
    this.moveTo(position + length);
    return this.raw.slice(position, position + length);
  }

  readString(length: number, position = this.nextIndex) {
    return String.fromCharCode(...this.read(length, position));
  }

  readUntil(stopAt: string[], minLength = 0, position = this.nextIndex) {
    let end = indexOf(this.raw, stopAt, position + minLength);
    if (end < 0) {
      end = this.raw.length;
    }
    this.moveTo(end);
    return this.raw.slice(position, end);
  }

  readNullTerminatedString(position = this.nextIndex) {
    const charCodes = [];
    while (this.raw[position] > 0) {
      charCodes.push(this.raw[position]);
      position++;
    }
    // Skip the null
    position++;
    this.moveTo(position);
    return String.fromCharCode(...charCodes);
  }

  readInt8(position = this.nextIndex) {
    this.moveTo(position + 1);
    return this.dataView.getUint8(position);
  }

  readInt16LE(position = this.nextIndex) {
    this.moveTo(position + 2);
    return this.dataView.getUint16(position, true);
  }

  readInt32LE(position = this.nextIndex) {
    this.moveTo(position + 4);
    return this.dataView.getUint32(position, true);
  }
}
