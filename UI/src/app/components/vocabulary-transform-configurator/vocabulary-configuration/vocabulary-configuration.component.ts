import { Component, OnInit, Input } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';

@Component({
  selector: 'app-vocabulary-configuration',
  templateUrl: './vocabulary-configuration.component.html',
  styleUrls: ['./vocabulary-configuration.component.scss']
})
export class VocabularyConfigurationComponent implements OnInit {
  @Input() name: string;
  @Input() vocabulary: IVocabulary = {name: '', payload: []};

  constructor() { }

  ngOnInit() {
  }

}
