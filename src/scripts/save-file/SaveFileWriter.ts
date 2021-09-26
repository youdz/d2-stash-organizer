const CHUNK_SIZE = 4096;

export class SaveFileWriter {
  private raw = new Uint8Array(CHUNK_SIZE);
  private dataView = new DataView(this.raw.buffer);

  public nextIndex = 0;

  done() {
    return this.raw.slice(0, this.nextIndex);
  }

  skip(bytes: number) {
    this.nextIndex += bytes;
  }

  write(values: number[], position = this.nextIndex) {
    if (position + values.length > this.raw.length) {
      const extended = new Uint8Array(this.raw.length + CHUNK_SIZE);
      extended.set(this.raw);
      this.raw = extended;
      this.dataView = new DataView(this.raw.buffer);
    }
    this.raw.set(values, position);
    this.nextIndex = position + values.length;
  }

  writeString(value: string, position = this.nextIndex) {
    const charCodes = [];
    for (let i = 0; i < value.length; i++) {
      charCodes[i] = value.charCodeAt(i);
    }
    this.write(charCodes, position);
  }

  writeInt16LE(value: number, position = this.nextIndex) {
    this.write(new Array(2).fill(0), position);
    this.dataView.setUint16(position, value, true);
  }

  writeInt32LE(value: number, position = this.nextIndex) {
    this.write(new Array(4).fill(0), position);
    this.dataView.setUint32(position, value, true);
  }
}
