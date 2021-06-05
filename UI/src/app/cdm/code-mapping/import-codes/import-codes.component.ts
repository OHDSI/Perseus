import { Component } from '@angular/core';
import { ImportCodesService } from '../../../services/import-codes/import-codes.service';
import { VocabularyObserverService } from '../../../services/vocabulary-search/vocabulary-observer.service';

@Component({
  selector: 'app-import-codes',
  templateUrl: './import-codes.component.html',
  styleUrls: ['./import-codes.component.scss']
})
export class ImportCodesComponent {

  constructor(private importCodesService: ImportCodesService,
              public vocabularyObserverService: VocabularyObserverService) { }

  get imported(): boolean {
    return this.importCodesService.imported
  }
}
