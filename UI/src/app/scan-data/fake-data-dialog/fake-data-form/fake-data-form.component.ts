import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fake-data-form',
  templateUrl: './fake-data-form.component.html',
  styleUrls: ['./fake-data-form.component.scss', '../../styles/scan-data-buttons.scss', '../../styles/scan-data-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeDataFormComponent implements OnInit {

  form: FormGroup;

  checkboxBackground = '#F9F9F9';

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  generate = new EventEmitter<{maxRowCount: number, doUniformSampling: boolean}>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      maxRowCount: [10e3, [Validators.required]],
      doUniformSampling: [false, [Validators.required]]
    });
  }
}
