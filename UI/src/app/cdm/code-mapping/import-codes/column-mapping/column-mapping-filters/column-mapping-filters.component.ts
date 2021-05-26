import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fillFilters, getFilters } from '../../../../../models/code-mapping/filters';
import { ImportCodesService } from '../../../../../services/import-codes/import-codes.service';

@Component({
  selector: 'app-column-mapping-filters',
  templateUrl: './column-mapping-filters.component.html',
  styleUrls: ['./column-mapping-filters.component.scss']
})
export class ColumnMappingFiltersComponent implements OnInit {

  @Input()
  form: FormGroup

  openedFilterName: string;

  dropdownFilters = getFilters()

  constructor(private importCodesService: ImportCodesService) { }

  ngOnInit(): void {
    this.initFilters()
  }

  private initFilters() {
    fillFilters(this.dropdownFilters, this.importCodesService)
  }
}
