import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../../import-codes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Column } from '../../../../grid/grid';

@Component({
  selector: 'app-column-mapping-panel',
  templateUrl: './column-mapping-panel.component.html',
  styleUrls: ['./column-mapping-panel.component.scss']
})
export class ColumnMappingPanelComponent implements OnInit {

  form: FormGroup

  columns: Column[];

  constructor(public importCodesService: ImportCodesService) { }

  ngOnInit(): void {
    this.initForm()

    this.initColumns()
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

  private initColumns() {
    this.columns = [
      {
        name: '',
        field: null
      },
      ...this.importCodesService.columns
    ]
  }
}
