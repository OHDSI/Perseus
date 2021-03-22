import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VocabularyBlock } from './vocabulary-block/vocabulary-block.component';
import { ConceptConfig } from '../model/config-concept';

@Component({
  selector: 'app-concept-config',
  templateUrl: './concept-config.component.html',
  styleUrls: ['./concept-config.component.scss']
})
export class ConceptConfigComponent implements OnInit {
  @Input() conceptConfig: ConceptConfig;
  @Output() outConfig = new EventEmitter<ConceptConfig>();

  get blocks(): VocabularyBlock[] {
    return this.conceptConfig.asArray || [];
  }

  constructor() {}

  ngOnInit() {}

  onVocabularyBlockChanged(event: any, block: any) {
    const oldBlock = this.conceptConfig.get(block.key);

    const vocabularyBlock: VocabularyBlock = {
      name: oldBlock.name,
      key: block.key,
      selectedin: event.selectedin,
      selectednotin: event.selectednotin,
      in: oldBlock.in,
      notin: oldBlock.notin,
      order: oldBlock.order
    };

    this.conceptConfig.updateVocabularyBlock(vocabularyBlock);

    this.outConfig.emit(this.conceptConfig);
  }
}
