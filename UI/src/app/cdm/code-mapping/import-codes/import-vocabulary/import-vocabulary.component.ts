import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImportCodesService } from '../../import-codes.service';
import { ImportVocabulariesService, Vocabulary } from '../../import-vocabularies.service';
import { parseHttpError } from '../../../../services/utilites/error';

@Component({
  selector: 'app-import-vocabulary',
  templateUrl: './import-vocabulary.component.html',
  styleUrls: ['./import-vocabulary.component.scss']
})
export class ImportVocabularyComponent implements OnInit {

  vocabularies: Vocabulary[]

  visibleVocabCount = 3

  showOther = false;

  loading = false;

  error: string;

  @ViewChild('csvInput', {static: true})
  csvInput: ElementRef

  @Output()
  import = new EventEmitter<void>()

  constructor(private importCodesService: ImportCodesService,
              private importVocabulariesService: ImportVocabulariesService) {
  }

  ngOnInit(): void {
    this.importVocabulariesService.all()
      .subscribe(vocabularies => this.vocabularies = vocabularies)
  }

  onShowOther() {
    this.showOther = !this.showOther
  }

  onImport() {
    this.csvInput.nativeElement.click()
  }

  onFileUpload(event: Event) {
    const csv = (event.target as HTMLInputElement).files[0]
    if (csv) {
      this.importCodesService.loadCsv(csv)
        .subscribe(
          () => this.import.emit(),
          error => this.error = error
        )
    }
  }

  onEdit(index: number) {
    // todo implementation
    console.log(index)
  }

  onRemove(index: number) {
    this.loading = true
    this.importVocabulariesService.remove(this.vocabularies[index].name)
      .subscribe(() => {
        this.vocabularies = this.importVocabulariesService.vocabularies
        this.loading = false
      }, error => {
        this.error = parseHttpError(error)
        this.loading = false
      })
  }

  onRemoveError() {
    this.error = null
  }
}
