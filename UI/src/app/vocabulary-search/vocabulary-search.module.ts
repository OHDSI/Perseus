import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterItemComponent } from './filter-item/filter-item.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { ChipComponent } from './chip/chip.component';
import { FormsModule } from '@angular/forms';
import { VocabularyButtonComponent } from './vocabulary-button/vocabulary-button.component';
import { CdmCommonModule } from '../common/cdm-common.module';

@NgModule({
  declarations: [
    VocabularySearchComponent,
    FilterItemComponent,
    FilterListComponent,
    ChipComponent,
    VocabularyButtonComponent
  ],
  exports: [
    VocabularySearchComponent,
    VocabularyButtonComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    CdmCommonModule
  ]
})
export class VocabularySearchModule {
}
