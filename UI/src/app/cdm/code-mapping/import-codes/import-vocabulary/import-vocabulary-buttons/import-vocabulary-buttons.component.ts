import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-import-vocabulary-buttons',
  templateUrl: './import-vocabulary-buttons.component.html',
  styleUrls: ['./import-vocabulary-buttons.component.scss']
})
export class ImportVocabularyButtonsComponent {

  @Output()
  edit = new EventEmitter<void>()

  @Output()
  remove = new EventEmitter<void>()
}
