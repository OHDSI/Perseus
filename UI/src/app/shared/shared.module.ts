import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';
import { VocabularyButtonComponent } from './vocabulary-button/vocabulary-button.component';

@NgModule({
  declarations: [
    CloseDialogButtonComponent,
    VocabularyButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CloseDialogButtonComponent,
    VocabularyButtonComponent
  ]
})
export class SharedModule {
}
