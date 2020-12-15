import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CdmStateService } from '../../../services/cdm-state.service';
import { BaseComponent } from '../../shared/base/base.component';
import { FakeDataStateService } from '../../../services/fake-data-state.service';
import { DbSettings } from '../../model/db-settings';
import { FakeDataParams } from '../../model/fake-data-params';

@Component({
  selector: 'app-cdm-form',
  templateUrl: './cdm-form.component.html',
  styleUrls: [
    './cdm-form.component.scss',
    '../../styles/scan-data-buttons.scss',
    '../../styles/scan-data-normalize.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdmFormComponent extends BaseComponent implements OnInit {

  sourceDbSettings: DbSettings;

  destinationDbSettings: DbSettings;

  sourceDataType: string;

  destinationDataType: string;

  fakeDataParams: FakeDataParams;

  constructor(private formBuilder: FormBuilder,
              private cdmStateService: CdmStateService,
              private fakeDataStateService: FakeDataStateService) {
    super();
  }

  ngOnInit(): void {
    this.loadState();
  }

  private loadState() {
    const {sourceDataType, destinationDataType, sourceDbSettings, destinationDbSettings} = this.cdmStateService.state;
    const fakeDataParams = this.fakeDataStateService.state;

    this.sourceDataType = sourceDataType;
    this.destinationDataType = destinationDataType;
    this.sourceDbSettings = sourceDbSettings;
    this.destinationDbSettings = destinationDbSettings;
    this.fakeDataParams = fakeDataParams;
  }
}

