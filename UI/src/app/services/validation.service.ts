import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    types: [ 'CLOB', 'INTEGER', 'STRING', 'NVARCHAR', 'VARCHAR', 'DATE', 'DATETIME' ]

    constructor() { }

    validateInput(rowType: string, value: string): string {
        const type = rowType.match('([^(]+)')[ 0 ];
        const maxLenght = Number(rowType.substring(rowType.indexOf('(') + 1, rowType.indexOf(')')));
        let result = '';
        switch (type) {
            case 'INTEGER':
                const test = value.match('^[-]?[0-9]*$');
                if (!value.match('^[-]?[0-9]*$')) {
                    result = 'Value must contain only digits';
                }
                break;
            case 'FLOAT':
                const test1 = value.match('^[-]?[0-9]*\.?[0-9]*$');
                if (!value.match('^[-]?[0-9]*\.?[0-9]*$')) {
                    result = 'Value must contain only digits and dot';
                }
                break;
            case 'DATE':
                const test2 = value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$');
                if (!value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$')) {
                    result = 'Format must be YYYY-MM-DD';
                }
                break;
            case 'DATETIME':
                const test3 = value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\\s([0-1]\\d|[2][0-3])\:[0-5]\\d\:[0-5]\\d$');
                if (!value.match('^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\\s([0-1]\\d|[2][0-3])\:[0-5]\\d\:[0-5]\\d$')) {
                    result = 'Format must be YYYY-MM-DD HH:MM:SS';
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
