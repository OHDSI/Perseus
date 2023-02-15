import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'capitalizePipe' })
export class CapitalizePipe implements PipeTransform {
    transform(input: string): string {
        if (input.length === 0) {
            return '';
        }

        let newStr = '';

        let prevChar = '';
        let charIsFirstOrAfterSpace = false;
        for (let char of input) {
            charIsFirstOrAfterSpace = prevChar === ' ' || prevChar === '';
            newStr = newStr.concat(charIsFirstOrAfterSpace ? char.toUpperCase() : char);
            prevChar = char;
        }
        return newStr;
    }
}