import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { IConnector } from 'src/app/models/interface/connector.interface';

@Component({
  selector: 'app-transformation-type',
  templateUrl: './transformation-type.component.html',
  styleUrls: [ './transformation-type.component.scss', '../set-connection-type-popup/set-connection-type-popup.component.scss' ]
})
export class TransformationTypeComponent {

  @Input() typeName: string;
  @Input() data;
  @Output() selectedType = new EventEmitter<string>();
  @Output() toggleCheckbox = new EventEmitter<string>();
  configured = false;
  isTypeChecked = false;

  constructor() { }

  ngOnInit(): void {
    this.configured = this.data && !!this.data[ 'name' ];
    this.isTypeChecked = this.data && !!this.data[ 'applied' ];
  }

  typeChecked() {
    this.isTypeChecked = !this.isTypeChecked;
    this.toggleCheckbox.emit();
  }

  typeSelected() {
    this.selectedType.emit(this.typeName);
  }
}
