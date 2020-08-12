import * as pako from 'pako';
import * as buf from 'buffer';
import { stringify } from 'flatted';
declare const Buffer;

const bufferKey = 'Buffer';
window[bufferKey] = window[bufferKey] || buf.Buffer;

const find = (
  symbol: string,
  buffer: Uint8Array,
  start: number,
  end: number
): number => {
  const code = symbol.charCodeAt(0);

  for (let i = start; i < end; i++) {
    const char = buffer[i];
    if (char === code) {
      const canBeSplitted = i === end - 1;

      if (!canBeSplitted) {
        return buffer[i + 1] === code ? i + 1 : i;
      } else {
        return -1;
      }
    }
  }
  return -1;
};

const findStartIndex = (buffer: Uint8Array): number => {
  const quote = '\''.charCodeAt(0);
  const comma = ','.charCodeAt(0);
  const colon = ':'.charCodeAt(0);

  if (buffer[0] === quote) {
    if (buffer[1] === colon) {
      return find('\'', buffer, 1, buffer.length);
    } else {
      return 0;
    }
  } else {
    return find(',', buffer, 0, buffer.length) + 1;
  }
};

const findFirst = (symbol: string, buffer: Uint8Array): number => {
  const code = symbol.charCodeAt(0);

  for (let i = 0; i < buffer.length; i++) {
    const char = buffer[i];
    if (char === code) {
      return i;
    }
  }
  return -1;
};

const findLast = (symbol: string, buffer: Uint8Array): number => {
  const code = symbol.charCodeAt(0);

  for (let i = buffer.length; i > 0; i--) {
    const char = buffer[i];
    if (char === code) {
      return i;
    }
  }
  return -1;
};

const findEndIndex = (buffer: Uint8Array): number => {
  const quote = '\''.charCodeAt(0);
  const comma = ','.charCodeAt(0);
  const colon = ':'.charCodeAt(0);

  const lastColonIndex = findLast(':', buffer);
  const lastCommaIndex = findLast(',', buffer);

  if (lastColonIndex > lastCommaIndex) {
    if (buffer.length - 1 - lastColonIndex > 0) {
      return buffer.length - 1;
    } else {
      return findLast(',', buffer) - 1;
    }
  } else {
    return lastCommaIndex - 1;
  }
};

const toUTF8Array = str => {
  const utf8 = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    } else {
      // surrogate pair
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return utf8;
};

function compressObjectToString(obj: any): string {
  const input = new Uint8Array(toUTF8Array(stringify(obj)));
  return pako.deflate(input).toString();
}

function decompressStringToObject(str: string): string {
  try {
    const input = str.split(',').map(v => +v);
    const result = pako.inflate(new Uint8Array(input));
    return Buffer.from(result).toString('UTF-8');
  } catch (error) {
    throw new Error(error);
  }
}

export {
  decompressStringToObject,
  compressObjectToString,
  toUTF8Array,
  findLast,
  findFirst,
  findEndIndex,
  findStartIndex,
  find
};
