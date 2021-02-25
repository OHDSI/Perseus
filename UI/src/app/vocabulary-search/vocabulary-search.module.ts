import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterItemComponent } from './filter-item/filter-item.component';
import { FilterListComponent } from './filter-list/filter-list.component';

@NgModule({
  declarations: [
    VocabularySearchComponent,
    FilterItemComponent,
    FilterListComponent
  ],
  exports: [
    VocabularySearchComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class VocabularySearchModule { }
