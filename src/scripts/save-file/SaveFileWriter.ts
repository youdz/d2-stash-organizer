const CHUNK_SIZE = 4096;

export class SaveFileWriter {
  private raw = new Uint8Array(CHUNK_SIZE);
  private dataView = new DataView(this.raw.buffer);

  public nextIndex = 0;

  done() {
    this.raw = this.raw.slice(0, this.nextIndex);
    this.dataView = new DataView(this.raw.buffer);
    return this.raw;
  }

  get length() {
    return this.raw.length;
  }

  skip(bytes: number) {
    this.nextIndex += bytes;
  }

  write(values: number[] | Uint8Array, position = this.nextIndex) {
    const end = position + values.length;
    if (end > this.raw.length) {
      const extended = new Uint8Array(
        Math.max(this.raw.length + CHUNK_SIZE, end)
      );
      extended.set(this.raw);
      this.raw = extended;
      this.dataView = new DataView(this.raw.buffer);
    }
    this.raw.set(values, position);
    this.nextIndex = end;
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

  computeChecksum() {
    let checksum = 0;
    for (const byte of this.raw) {
      // rotate left once
      checksum = (checksum << 1) | (checksum >>> 31);
      checksum += byte;
      // Convert back to uint32
      checksum >>>= 0;
    }
    return checksum;
  }
}
