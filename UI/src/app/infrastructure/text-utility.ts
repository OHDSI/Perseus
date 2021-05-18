import * as pako from 'pako';
import * as buf from 'buffer';

declare const Buffer;

const bufferKey = 'Buffer';
window[bufferKey] = window[bufferKey] || buf.Buffer;

export const find = (
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

export const findLast = (symbol: string, buffer: Uint8Array): number => {
  const code = symbol.charCodeAt(0);

  for (let i = buffer.length; i > 0; i--) {
    const char = buffer[i];
    if (char === code) {
      return i;
    }
  }
  return -1;
};

export const findEndIndex = (buffer: Uint8Array): number => {
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

export function decompressStringToObject(str: string): string {
  try {
    const input = str.split(',').map(v => +v);
    const result = pako.inflate(new Uint8Array(input));
    return Buffer.from(result).toString('UTF-8');
  } catch (error) {
    throw new Error(error);
  }
}
