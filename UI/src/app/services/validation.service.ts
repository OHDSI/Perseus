import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    constructor() { }

    validateInput(rowType: string, value: string): string {
        if (value === '' || value === null) {
          return null
        }
        const type = rowType.match('([^(]+)')[ 0 ];
        const maxLenght = Number(rowType.substring(rowType.indexOf('(') + 1, rowType.indexOf(')')));
        let result = '';
        switch (type) {
            case 'integer':
            case 'INTEGER':
                if (!value.match('^[-]?[0-9]*$')) {
                    result = 'Value must contain only digits';
                }
                break;
            case 'float':
            case 'FLOAT':
                if (!value.match('^[-]?[0-9]*\.?[0-9]*$')) {
                    result = 'Value must contain only digits and dot';
                }
                break;
            case 'date':
            case 'DATE':
                if (!value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$')) {
                    result = 'Format must be YYYY-MM-DD';
                }
                break;
            case 'datetime':
            case 'DATETIME':
                if (!value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\\s([0-1]\\d|[2][0-3])\:[0-5]\\d\:[0-5]\\d$')) {
                    result = 'Format must be YYYY-MM-DD HH:MM:SS';
                }
                break;
            case 'time':
            case 'TIME':
                if (!value.match('^([0-1]\\d|[2][0-3])\:[0-5]\\d\:[0-5]\\d$')) {
                  result = 'Format must be HH:MM:SS';
                }
                break;
            default:
                if (maxLenght && value.length > maxLenght) {
                    result = 'Max length exceeded';
                }
        }

        return result;
    }
}
