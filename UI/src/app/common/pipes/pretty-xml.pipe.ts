import { Pipe, PipeTransform } from '@angular/core';
import { isString } from '../../infrastructure/utility';
import { prettify } from './xml-prettier';

@Pipe({
  name: 'prettyXml'
})
/**
 * Remove special chacracters [ _ , ? ] and capitalize first character of the string
 */
export class PrettyXmlPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if (isString(value)) {
      return prettify(value, null);
    }
    return '';
    }
}


