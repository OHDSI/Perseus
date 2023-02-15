import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'splitCapitalizedPipe' })
export class SplitCapitalizedPipe implements PipeTransform {
    transform(input: string): string {
        if (input.length === 0) {
            return '';
        }

        let newStr = '';
        let isCurrentCharUppercase = false;
        for (let char of input) {
            isCurrentCharUppercase = char === char.toUpperCase();
            newStr = newStr.concat(isCurrentCharUppercase ? ` ${char}` : char);
        }

        return newStr;
    }
}