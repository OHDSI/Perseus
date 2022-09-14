import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { createFakeDataForm } from '@utils/form';
import { uniformSamplingTooltipText } from '../../scan-data.constants';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings'
import { FakeDataStateService } from '@services/white-rabbit/fake-data-state.service'

@Component({
  selector: 'app-fake-data-form',
  templateUrl: './fake-data-form.component.html',
  styleUrls: ['./fake-data-form.component.scss', '../../styles/scan-data-buttons.scss', '../../styles/scan-data-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeDataFormComponent implements OnInit, OnDestroy {
  form: FormGroup;

  checkboxBackground = '#F9F9F9';

  @Input()
  loading: boolean

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  generate = new EventEmitter<FakeDataSettings>();

  uniformSamplingTooltip = uniformSamplingTooltipText;

  constructor(private fakeDataStateService: FakeDataStateService) {
  }

  ngOnInit(): void {
    this.form = createFakeDataForm(this.fakeDataStateService.state);
  }

  ngOnDestroy() {
    this.fakeDataStateService.state = this.form.value
  }

  onGenerate(): void {
    this.generate.emit(this.form.value)
  }
}
