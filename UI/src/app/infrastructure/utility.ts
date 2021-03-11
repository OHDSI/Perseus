import isDate from 'lodash-es/isDate';
import isFunction from 'lodash-es/isFunction';
import isString from 'lodash-es/isString';
import isArray from 'lodash-es/isArray';
import isObject from 'lodash-es/isObject';
import isUndefined from 'lodash-es/isUndefined';
import uniq from 'lodash-es/uniq';
import uniqBy from 'lodash-es/uniqBy';
import clone from 'lodash-es/clone';
import cloneDeep from 'lodash-es/cloneDeep';
import uniqWith from 'lodash-es/uniqWith';
import filter from 'lodash-es/filter';
import assign from 'lodash-es/assign';
import groupBy from 'lodash-es/groupBy';
import isEqual from 'lodash-es/isEqual';

const noop = () => {};
const yes = () => true;
const no = () => false;
const identity = arg => arg;

function defaults<T>(...args: any[]): T {
  const dst = args[0];
  const result = { ...dst } as T;

  for (let i = 1, sourcesLength = args.length; i < sourcesLength; i++) {
    const source = args[i];

    if (!source) {
      continue;
    }

    const keys = Object.keys(source);

    for (let k = 0, keysLength = keys.length; k < keysLength; k++) {
      const key = keys[k];
      if (!result.hasOwnProperty(key)) {
        result[key] = source[key];
      }
    }
  }

  return result;
}

function override(dst, src) {
  const keys = Object.keys(src);
  const length = keys.length;

  for (let i = 0; i < length; i++) {
    const key = keys[i];
    dst[key] = src[key];
  }

  return dst;
}

function escapeRegexp(text) {
  if (!text) {
    return text;
  } else {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

function findIn<T>(origin: T[], theirs: T[], compare?: any): T[] {
  if (compare) {
    return origin.filter(function(e) {
      return this.findIndex(x => compare(x, e)) > -1;
    }, theirs);
  }

  return origin.filter(function(e) {
    return this.indexOf(e) > -1;
  }, theirs);
}

function dashedDateToString(mdate: Date): string {
  let dayStr = '00';
  let monthStr = '00';

  const day = mdate.getDate();
  const month = mdate.getMonth() + 1;

  if (day < 10) {
    dayStr = `0${day}`;
  } else {
    dayStr = `${day}`;
  }

  if (month < 10) {
    monthStr = `0${month}`;
  } else {
    monthStr = `${month}`;
  }


  return `${dayStr}-${monthStr}-${mdate.getFullYear()}`;
}

function generateString(len: number): string {
  const length = len ? len : 10;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let token = '';
  let character = '';
  const crunch = true;
  while (token.length < length) {
    const entity1 = Math.ceil(letters.length * Math.random() * Math.random());
    const entity2 = Math.ceil(numbers.length * Math.random() * Math.random());
    let hold = letters.charAt(entity1);
    hold = entity1 % 2 === 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numbers.charAt(entity2);
    token = character;
  }

  return token;
}

export {
  isDate,
  isFunction,
  isString,
  isArray,
  isObject,
  isUndefined,
  uniq,
  uniqBy,
  clone,
  cloneDeep,
  noop,
  yes,
  no,
  identity,
  defaults,
  override,
  uniqWith,
  filter,
  escapeRegexp,
  assign,
  groupBy,
  isEqual,
  findIn,
  dashedDateToString,
  generateString
};

