import { FormControl, FormGroup, Validators } from '@angular/forms';

export function createFakeDataForm() {
  return new FormGroup(
    {
      maxRowCount: new FormControl(10e3, [Validators.required]),
      doUniformSampling: new FormControl(false, [Validators.required])
    }
  );
}
