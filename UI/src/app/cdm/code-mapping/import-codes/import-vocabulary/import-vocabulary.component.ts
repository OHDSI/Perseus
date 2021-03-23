import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import',
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
    }
  ]

  otherVocabularies = [
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

  showOther = false;

  constructor() { }

  ngOnInit(): void {
  }

  onShowOther() {
    this.showOther = !this.showOther
  }
}
