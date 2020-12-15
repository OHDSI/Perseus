import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FakeDataParams } from '../model/fake-data-params';

export function createFakeDataForm(value: FakeDataParams =
                                     {maxRowCount: 10e3, doUniformSampling: false}) {
  return new FormGroup(
    {
      maxRowCount: new FormControl(value.maxRowCount, [Validators.required]),
      doUniformSampling: new FormControl(value.doUniformSampling, [Validators.required])
    }
  );
}

export function createCdmDbSettingsForm(disabled: boolean, formBuilder: FormBuilder): FormGroup {
  return formBuilder.group({
    server: [{value: null, disabled}, [Validators.required]],
    user: [{value: null, disabled}, [Validators.required]],
    password: [{value: null, disabled}, [Validators.required]],
    database: [{value: null, disabled}, [Validators.required]],
    schemaName: [{value: null, disabled}, [Validators.required]]
  });
}

export const cdmDbSettingsFromControlNames = [
  'server', 'user', 'password', 'database', 'schemaName'
];
