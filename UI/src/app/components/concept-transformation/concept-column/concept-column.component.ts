import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { getConceptFieldNameByType } from 'src/app/services/utilites/concept-util';
import { SelectConceptFieldComponent } from '../../popups/select-concept-field/select-concept-field.component';
import * as conceptMap from './../../concept-fileds-list.json'

@Component({
  selector: 'app-concept-column',
  templateUrl: './concept-column.component.html',
  styleUrls: [ './concept-column.component.scss', './../concept-transformation.component.scss' ]
})
export class ConceptColumnComponent implements OnInit {

  @Input() field: any;
  @Input() conceptFields: any;
  @Input() row: any;
  @Input() fieldType: any;
  @Input() connectedToConceptFields: any;
  @Input() targetTableName: any;
  @Input() concepts: any;
  conceptFieldsMap = (conceptMap as any).default;

  errorText = '';

  get constant(): string {
    return this.field.constant.replace(/['"]+/g, '');
  }

  set constant(cons: string) {
    this.field.constant = `"${cons}"`;
  }

  constructor(private overlayService: OverlayService) { }
  

  ngOnInit(): void {
  }

  openConceptFieldsDropdown(target: any){

    const conceptColumnName = getConceptFieldNameByType(this.fieldType, this.conceptFieldsMap[this.targetTableName]);

    const data = {
      fields: [ 'Constant' ].concat(this.connectedToConceptFields[ conceptColumnName ]
        .map(it => it.source.name)),
      selected: this.row.fields[this.fieldType].field
    };

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'filter-popup',
      positionStrategyFor: 'concept-fields-dropdown',
      payload: data,
    };
    const overlayRef = this.overlayService.open(dialogOptions, target, SelectConceptFieldComponent);

    overlayRef.afterClosed$.subscribe(() => {
      if (data.selected === 'Constant') {
        this.row.fields[this.fieldType].constantSelected = true;
        this.row.fields[this.fieldType].field = undefined
      } else {
        this.row.fields[this.fieldType].field = data.selected;
        this.row.fields[this.fieldType].constantSelected = false;
      }

      if (!this.validateSelectedField(this.row.fields[this.fieldType].field)){
        this.row.fields[this.fieldType].alreadySelected = true;
        this.errorText = `${this.row.fields[this.fieldType].field} field is already used`
      }
      else {
        this.row.fields[this.fieldType].alreadySelected = false;
      };
    });
  }

  validateSelectedField(field: any){
     return !this.concepts.filter(it=> it.id !== this.row.id).map(it => it.fields[this.fieldType].field).includes(field);
  }


}
