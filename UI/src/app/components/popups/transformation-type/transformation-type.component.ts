import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IConnector } from 'src/app/models/interface/connector.interface';

@Component({
  selector: 'app-transformation-type',
  templateUrl: './transformation-type.component.html',
  styleUrls: [ './transformation-type.component.scss', '../set-connection-type-popup/set-connection-type-popup.component.scss' ]
})
export class TransformationTypeComponent {

  @Input() typeName: string;
  @Input() configured: boolean;
  @Input() isTypeChecked: boolean;
  @Output() selectedType = new EventEmitter<string>();
  @Output() TypeCheckedEvent = new EventEmitter<boolean>();

  constructor() { }

  typeChecked() {
    this.isTypeChecked = !this.isTypeChecked;
    this.TypeCheckedEvent.emit(this.isTypeChecked);
  }

  typeSelected() {
    this.selectedType.emit(this.typeName);
  }
}
