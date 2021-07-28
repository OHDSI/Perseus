import { NgModule } from '@angular/core';
import { VocabularySearchComponent } from './vocabulary-search.component';
import { ChipComponent } from './chip/chip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VocabularyButtonComponent } from './vocabulary-button/vocabulary-button.component';
import { SharedModule } from '@shared/shared.module';
import { GridModule } from '@grid/grid.module';

@NgModule({
  declarations: [
    VocabularySearchComponent,
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
