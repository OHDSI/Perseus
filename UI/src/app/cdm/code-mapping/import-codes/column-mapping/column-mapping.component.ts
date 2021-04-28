import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../../../../services/import-codes/import-codes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-column-mapping',
  templateUrl: './column-mapping.component.html',
  styleUrls: [
    './column-mapping.component.scss',
    '../styles/column-mapping-panel.scss',
    '../styles/import-codes-wrapper.scss'
  ]
})
export class ColumnMappingComponent implements OnInit {

  form: FormGroup

  constructor(public importCodesService: ImportCodesService) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  onBack() {
    this.importCodesService.reset()
  }

  onApply() {
  }

  private initForm() {
    this.form = new FormGroup({
      sourceCode: new FormControl(null),
      sourceName: new FormControl(null, [Validators.required]),
      sourceFrequency: new FormControl(null),
      autoConceptId: new FormControl(null),
      additionalInfo: new FormControl(null),
    })
  }
}
