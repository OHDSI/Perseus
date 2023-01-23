import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'typeofPipe'})
export class TypeofPipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value !== 'boolean' && !Number.isNaN(+value)) {
            return 'number';
        } else if (value instanceof Date || !Number.isNaN(Date.parse(value))) {
            return 'Date';
        } else if (typeof value !== 'object' && typeof value !== 'function') {
            return typeof value;
        }
        return typeof value;
    }
}