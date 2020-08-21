import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transformation-type',
  templateUrl: './transformation-type.component.html',
  styleUrls: [ './transformation-type.component.scss', '../set-connection-type-popup/set-connection-type-popup.component.scss' ]
})
export class TransformationTypeComponent implements OnInit {

  @Input() typeName: string;
  @Output() selectedType = new EventEmitter<string>();
  configured = false;
  isTypeChecked = false;

  constructor() { }

  ngOnInit(): void {
  }

  typeChecked() {
    this.isTypeChecked = !this.isTypeChecked;
  }

  typeSelected() {
    this.selectedType.emit(this.typeName);
  }
}
