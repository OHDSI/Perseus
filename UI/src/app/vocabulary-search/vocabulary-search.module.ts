import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [VocabularySearchComponent],
  exports: [
    VocabularySearchComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class VocabularySearchModule { }
