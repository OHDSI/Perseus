import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export function createFakeDataForm(value =
                                     {maxRowCount: 10e3, doUniformSampling: false}) {
  return new FormGroup(
    {
      maxRowCount: new FormControl(value.maxRowCount, [Validators.required]),
      doUniformSampling: new FormControl(value.doUniformSampling, [Validators.required])
    }
  );
}

export function createDbConnectionForm(disabled: boolean, requireDb: boolean, requireSchema: boolean, requireHTTPPath: boolean, requireUser: boolean, formBuilder: FormBuilder): FormGroup {
  const schemaValidators = requireSchema ? [Validators.required] : [];
  const dbValidators = requireDb ? [Validators.required] : [];
  const httppathValidators = requireHTTPPath ? [Validators.required] : [];
  const userValidators = requireUser ? [Validators.required] : [];
  
  return formBuilder.group({
    server: [{value: null, disabled}, [Validators.required]],
    port: [{value: null, disabled}, [Validators.required]],
    user: [{value: null, disabled}, userValidators],
    httppath: [{value: null, disabled}, httppathValidators],
    password: [{value: null, disabled}, [Validators.required]],
    database: [{value: null, disabled}, dbValidators],
    schema: [{value: null, disabled}, schemaValidators]
  });
}
