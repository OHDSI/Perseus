import { Component, OnInit, Input } from '@angular/core';
import { VocabularyBlock } from '../vocabulary-block/vocabulary-block.component';
import { ConceptConfig } from '../model/config-concept';

@Component({
  selector: 'app-concept-config',
  templateUrl: './concept-config.component.html',
  styleUrls: ['./concept-config.component.scss']
})
export class ConceptConfigComponent implements OnInit {
  @Input() conceptConfig: ConceptConfig;

  get blocks(): VocabularyBlock[] {
    return this.conceptConfig.asArray || [];
  }

  constructor() { }

  ngOnInit() {
  }

  sourceVocabulary(event: VocabularyBlock) {
    const key = 'source_vocabulary';
    // this.updateModel(key, event);
  }

}
