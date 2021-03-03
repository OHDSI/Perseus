import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';

@NgModule({
  declarations: [
    CloseDialogButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CloseDialogButtonComponent
  ]
})
export class SharedModule { }
