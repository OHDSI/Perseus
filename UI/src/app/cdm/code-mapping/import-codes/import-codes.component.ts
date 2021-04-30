import { Component } from '@angular/core';
import { ImportCodesService } from '../../../services/import-codes/import-codes.service';

@Component({
  selector: 'app-import-codes',
  templateUrl: './import-codes.component.html',
  styleUrls: ['./import-codes.component.scss']
})
export class ImportCodesComponent {

  constructor(private importCodesService: ImportCodesService) { }

  get imported(): boolean {
    return this.importCodesService.imported
  }
}
