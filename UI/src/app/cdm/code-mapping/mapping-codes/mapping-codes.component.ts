import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportCodesService } from '../../../services/import-codes/import-codes.service';

@Component({
  selector: 'app-mapping-codes',
  templateUrl: './mapping-codes.component.html',
  styleUrls: ['./mapping-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MappingCodesComponent {

  constructor(private importCodesService: ImportCodesService) {
  }

  get applyDisabled() {
    return this.importCodesService.codeMappings.every(codeMapping => !codeMapping.selected)
  }

  onBack() {
  }

  onApply() {
  }
}
