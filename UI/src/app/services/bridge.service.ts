import { Injectable, Inject } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { ArrowCache, Arrow } from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { Subject } from 'rxjs';
import { uniqBy } from '../infrastructure/utility';

@Injectable()
export class BridgeService {
  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};

  connection = new Subject();

  constructor(
    private commonService: CommonService,
    private drawService: DrawService
  ) {}

  set sourceRow(row: IRow) {
    this.sourcerow = row;
  }
  get sourceRow() {
    return this.sourcerow;
  }

  set targetRow(row: IRow) {
    this.targetrow = row;
  }
  get targetRow() {
    return this.targetrow;
  }

  get targetRowElement() {
    return this.targetrowrlement;
  }
  set targetRowElement(element: HTMLElement) {
    this.targetrowrlement = element;
  }

  //private sourceRow: IRow;
  //private targetRow: IRow;

  connect() {
    const arrowId = this.drawService.drawLine(this.sourceRow, this.targetRow);
    this.arrowsCache[arrowId] = {
      source: this.sourceRow,
      target: this.targetRow
    };

    // ???
    this.commonService.linked = true;

    //
    this.connection.next();
  }

  recalculateConnectorsPositions() {
    if (!this.drawService.listIsEmpty) {
      this.drawService.adjustArrowsPositions();

      //this._recalculateButtonPosition(drawEntity.button, drawEntity.line);
    }
  }

  reset() {
    this.sourceRow = null;
    this.targetRow = null;
  }

  getStyledAsDragStartElement() {
    this.sourceRow.htmlElement.classList.add('drag-start');
  }

  getStyledAsDragEndElement() {
    this.sourceRow.htmlElement.classList.remove('drag-start');
  }

  refreshAll() {
    this.drawService.removeAllConnectors();

    Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
      this.drawService.drawLine(arrow.source, arrow.target);
    });
  }

  deleteArrow(key: string) {
    this.drawService.removeConnector(key);

    if (this.arrowsCache[key]) {
      delete this.arrowsCache[key];
    }
  }

  deleteTableArrows(table: ITable): void {
    this.drawService.removeConnectorsBoundToTable(table);
  }

  deleteAllArrows() {
    this.arrowsCache = {};
    this.drawService.removeAllConnectors();
  }

  generateMapping() {
    const mappingService = new MappingService(this.arrowsCache);
    return mappingService.generate();
  }

  hasConnection(table: ITable): boolean {
    return Object.values(this.arrowsCache).filter(connection => {
      return connection.source.tableName == table.name ||
      connection.target.tableName === table.name
    }).length > 0;
  }



  findCorrespondingTables(table: ITable): string[] {
    const source = table.area === 'source' ? 'target' : 'source';
    const data = Object.values(this.arrowsCache).filter(connection => {
      return connection[table.area].tableName == table.name
    })
    .map(arrow => arrow[source]);

    return uniqBy(data, 'tableName').map(row => row.tableName);
  }

  // Injectors
  // private componentFactoryResolver: ComponentFactoryResolver,
  // private appRef: ApplicationRef,
  // private injector: Injector,
  // // TODO Move
  // private _appendButton(drawEntity: Connector) {
  //   const line = drawEntity.line;
  //   const componentRef = this.componentFactoryResolver
  //     .resolveComponentFactory(BridgeButtonComponent)
  //     .create(this.injector);
  //   componentRef.instance.drawEntity = drawEntity;

  //   this.appRef.attachView(componentRef.hostView);

  //   const button = (componentRef.hostView as EmbeddedViewRef<any>)
  //     .rootNodes[0] as HTMLElement;

  //   const canvas = this.document.querySelector('.main');
  //   canvas.appendChild(button);

  //   const { top, left } = this._calculateButtonPosition(button, line);

  //   button.style.top = top + 'px';
  //   button.style.left = left + 'px';

  //   return button;
  // }

  // // TODO Move
  // private _recalculateButtonPosition(button, line) {
  //   const { top, left } = this._calculateButtonPosition(button, line);

  //   button.style.top = top + 'px';
  //   button.style.left = left + 'px';
  // }

  // // TODO Move
  // private _calculateButtonPosition(button, line) {
  //   const canvas = this.document.querySelector('.main');
  //   const buttonClientRect = button.getBoundingClientRect();
  //   const buttonOffsetX = buttonClientRect.width / 2;
  //   const buttonOffsetY = buttonClientRect.height / 2;

  //   return {
  //     top: middleHeightOfLine(line) - buttonOffsetY,
  //     left:
  //       canvas.clientWidth / 2 - buttonOffsetX - areaOffset(this.commonService)
  //   };
  // }
}




