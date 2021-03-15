import { AbstractControl, ValidatorFn } from '@angular/forms';

export class SqlNameValidatorService {
    static checkExistingName(tables: any, action: any): ValidatorFn {
        return (control: AbstractControl): { [ key: string ]: any } | null => {
            return (tables.findIndex((item: any) => item.name.toUpperCase() === control.value.toUpperCase()) !== -1 && action === 'Create')
                ? { name: true }
                : null;
        };
    }
}
