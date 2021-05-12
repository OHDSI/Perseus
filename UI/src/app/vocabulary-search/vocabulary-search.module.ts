import { NgModule } from '@angular/core';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { FilterItemComponent } from './filter-item/filter-item.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { ChipComponent } from './chip/chip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VocabularyButtonComponent } from './vocabulary-button/vocabulary-button.component';
import { SharedModule } from '../shared/shared.module';
import { GridModule } from '../grid/grid.module';

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
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule
  ]
})
export class VocabularySearchModule {
}
