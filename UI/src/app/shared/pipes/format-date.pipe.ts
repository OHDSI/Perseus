import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDatePipe' })
export class FormatDatePipe implements PipeTransform {
    private YEAR = 'YYYY';
    private MONTH = 'MM';
    private DAY = 'DD';
    transform(date: Date, format: string): number | Date {
        switch (format) {
            case this.YEAR:
                return date.getFullYear();
            case this.MONTH:
                return date.getMonth();
            case this.DAY:
                return date.getDay();
            default:
                return date;
        }
    }
}