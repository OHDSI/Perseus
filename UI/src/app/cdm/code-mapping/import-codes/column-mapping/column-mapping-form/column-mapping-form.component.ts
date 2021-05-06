import { Component, Input, OnInit } from '@angular/core';
import { ImportCodesService } from '../../../../../services/import-codes/import-codes.service';
import { FormGroup } from '@angular/forms';
import { Column } from '../../../../../models/grid/grid';

@Component({
  selector: 'app-column-mapping-form',
  templateUrl: './column-mapping-form.component.html',
  styleUrls: ['./column-mapping-form.component.scss']
})
export class ColumnMappingFormComponent implements OnInit {

  @Input()
  form: FormGroup

  columns: Column[];

  constructor(public importCodesService: ImportCodesService) { }

  ngOnInit(): void {
    this.initColumns()
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
