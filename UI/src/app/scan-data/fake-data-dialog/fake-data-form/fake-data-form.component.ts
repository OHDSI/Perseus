import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createFakeDataForm } from '../../../utilites/form';
import { uniformSamplingTooltipText } from '../../scan-data.constants';

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

  uniformSamplingTooltip = uniformSamplingTooltipText;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = createFakeDataForm();
  }
}
