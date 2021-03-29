import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImportCodesService } from '../../import-codes.service';

@Component({
  selector: 'app-import-vocabulary',
  templateUrl: './import-vocabulary.component.html',
  styleUrls: ['./import-vocabulary.component.scss']
})
export class ImportVocabularyComponent implements OnInit {

  vocabularies = [
    {
      name: 'ABMS'
    },
    {
      name: 'AMT'
    },
    {
      name: 'APC'
    },
    {
      name: 'BDPB'
    },
    {
      name: 'CCAM'
    },
    {
      name: 'CDM'
    },
    {
      name: 'CGI'
    }
  ]

  visibleVocabCount = 3

  showOther = false;

  @ViewChild('csvInput', {static: true}) csvInput: ElementRef

  constructor(private importCodesService: ImportCodesService) { }

  ngOnInit(): void {
  }

  onShowOther() {
    this.showOther = !this.showOther
  }

  onImport() {
    this.csvInput.nativeElement.click()
  }

  onFileUpload(event: Event) {
    const csv = (event.target as HTMLInputElement).files[0]
    this.importCodesService.loadCsv(csv)
  }

  onEdit(index: number) {
    console.log(index)
  }

  onRemove(index: number) {
    console.log(index)
  }
}
