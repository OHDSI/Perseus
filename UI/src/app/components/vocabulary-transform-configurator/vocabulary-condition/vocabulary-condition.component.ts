import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-vocabulary-condition',
  templateUrl: './vocabulary-condition.component.html',
  styleUrls: ['./vocabulary-condition.component.scss']
})
export class VocabularyConditionComponent implements OnInit {
  @Input() sourcefields: string[];
  @Input() operators = ['>', '<', '=', '!='];

  conditionValue = new FormControl();

  constructor() {}

  ngOnInit() {}

  onLookupSelected() {}
}
