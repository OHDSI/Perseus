import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'typeofPipe'})
export class TypeofPipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value !== 'object' && typeof value !== 'function') {
            return typeof value;
        } else if (value instanceof Date) {
            return 'Date';
        }
        return typeof value;
    }
}