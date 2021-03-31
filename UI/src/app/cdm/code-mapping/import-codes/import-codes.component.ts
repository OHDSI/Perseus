import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../import-codes.service';

@Component({
  selector: 'app-import-codes',
  templateUrl: './import-codes.component.html',
  styleUrls: ['./import-codes.component.scss']
})
export class ImportCodesComponent implements OnInit {

  imported: boolean

  constructor(private importCodesService: ImportCodesService) { }

  ngOnInit(): void {
    this.imported = this.importCodesService.imported
  }

  onImport() {
    this.imported = true
  }
}
