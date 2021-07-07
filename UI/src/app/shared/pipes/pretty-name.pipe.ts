import { Pipe, PipeTransform } from '@angular/core';
import { isString } from '../../infrastructure/utility';

@Pipe({
  name: 'prettyName'
})
/**
 * Remove special chacracters [ _ , ? ] and capitalize first character of the string
 */
export class PrettyNamePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if (isString(value)) {
      value = value || '';

      value = value
        .replace(/\_/g, ' ') // replace all non word chacracters with space
        .replace(/\w\S*/g, text => {
          return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        }); // capitalize frist character

      return value.trim();
    }

    return '';
  }
}




