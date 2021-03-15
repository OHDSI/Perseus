import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterItemComponent } from './filter-item/filter-item.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { ChipComponent } from './chip/chip.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    VocabularySearchComponent,
    FilterItemComponent,
    FilterListComponent,
    ChipComponent
  ],
  exports: [
    VocabularySearchComponent
  ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        FormsModule,
        SharedModule
    ]
})
export class VocabularySearchModule { }
