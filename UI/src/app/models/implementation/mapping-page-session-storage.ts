import { Injectable } from '@angular/core';
import { isString, isObject } from 'src/app/infrastructure/utility';
import {
  compressObjectToString,
  decompressStringToObject
} from 'src/app/infrastructure/text-utility';
import { parse } from 'flatted';

@Injectable()
export class MappingPageSessionStorage {
  configuration: any;
  private storage: any;

  constructor() {
    this.storage = localStorage;
    this.configuration = {};
  }

  add(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let prepareValue = '';
        if (isString(value)) {
          prepareValue = value;
        } else if (isObject(value)) {
          prepareValue = compressObjectToString(value);
        }

        if (this.storage.getItem(key)) {
          this.remove(key);
          this.storage.setItem(key, prepareValue); // update
        } else {
          this.storage.setItem(key, prepareValue);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  get(key?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let value;
      if (key) {
        value = this.storage.getItem(key);
      } else {
        value = this.storage.getItem(key);
      }

      if (value) {
        try {
          const configText = decompressStringToObject(value);
          const parsed = parse(configText);
          resolve(parsed);
        } catch (error) {
          try {
            resolve(parse(value));
          } catch (error) {
            resolve(value);
          }
        }
      } else {
        reject('storage has no saved items');
      }
    });
  }

  remove(key?: string): void {
    this.storage.removeItem(key);
  }
}
