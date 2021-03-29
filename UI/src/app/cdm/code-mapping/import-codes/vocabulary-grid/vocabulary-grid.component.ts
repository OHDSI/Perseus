import { Component, OnInit } from '@angular/core';
import { ImportCodesService } from '../../import-codes.service';

@Component({
  selector: 'app-vocabulary-grid',
  templateUrl: './vocabulary-grid.component.html',
  styleUrls: ['./vocabulary-grid.component.scss']
})
export class VocabularyGridComponent implements OnInit {

  constructor(public importCodesService: ImportCodesService) { }

  ngOnInit(): void {
  }

}
