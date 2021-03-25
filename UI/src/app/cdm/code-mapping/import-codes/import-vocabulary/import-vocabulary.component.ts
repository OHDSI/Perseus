import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

  @ViewChild('csvInput', {static: true}) csvInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  onShowOther() {
    this.showOther = !this.showOther
  }

  onImport() {
    this.csvInput.nativeElement.click()
  }

  onFileUpload(event: Event) {
    console.log(event)
  }

  onEdit(index: number) {
    console.log(index)
  }

  onRemove(index: number) {
    console.log(index)
  }
}
