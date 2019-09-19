import { Injectable } from '@angular/core';
import { DrawService } from 'src/app/services/draw.service';
import { IRow } from 'src/app/models/row';
import { ArrowCache, Arrow } from '../models/arrow-cache';
import { MappingService } from '../models/mapping-service';
import { ITable } from '../models/table';
import { Subject } from 'rxjs';
import { uniqBy } from '../infrastructure/utility';
import { Configuration } from '../models/configuration';
import { StateService } from './state.service';
import { BridgeButtonService } from './bridge-button.service';
import { UserSettings } from './user-settings.service';
import { IConnector } from '../models/interface/connector.interface';

export interface IConnection {
  source: IRow;
  target: IRow;
  transforms?: any;
}

@Injectable()
export class BridgeService {
  applyConfiguration$ = new Subject<Configuration>();
  resetAllMappings$ = new Subject<any>();

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

  private sourcerow: IRow;
  private targetrow: IRow;
  private targetrowrlement = null;

  arrowsCache: ArrowCache = {};
  connection = new Subject<IConnection>();

  deleteAll = new Subject();

  constructor(
    private drawService: DrawService,
    private bridgeButtonService: BridgeButtonService,
    private userSettings: UserSettings,
    private stateService: StateService
  ) {}

  applyConfiguration(configuration: Configuration) {
    this.removeAllArrows();

    this.arrowsCache = Object.assign(configuration.arrows);

    this.applyConfiguration$.next(configuration);
  }

  connect() {
    const connector = this.drawService.drawLine(this.sourceRow, this.targetRow);
    if (this.userSettings.showQuestionButtons) {
      this.bridgeButtonService.createButton(connector, this.arrowsCache);
    }

    const connection: IConnection = {
      source: this.sourceRow,
      target: this.targetRow,
      transforms: []
    };

    this.arrowsCache[connector.id] = connection;

    this.connection.next(connection);
  }

  adjustArrowsPositions() {
    const { list } = this.drawService;

    Object.keys(list).forEach(key => {
      const drawEntity: IConnector = list[key];
      drawEntity.adjustPosition();

      if (this.userSettings.showQuestionButtons) {
        this.bridgeButtonService.recalculateButtonPosition(
          drawEntity.button,
          drawEntity.line
        );
      }
    });
  }

  recalculateConnectorsPositions() {
    if (!this.drawService.listIsEmpty) {
      this.adjustArrowsPositions();
    }
  }

  getStyledAsDragStartElement() {
    this.sourceRow.htmlElement.classList.add('drag-start');
  }

  getStyledAsDragEndElement() {
    this.sourceRow.htmlElement.classList.remove('drag-start');
  }

  refresh(targetTableName) {
    this.drawService.removeConnectors();

    Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
      if (targetTableName === arrow.target.tableName) {
        const source = this.stateService.findTable(arrow.source.tableName);
        const target = this.stateService.findTable(arrow.target.tableName);
        if (source.expanded && target.expanded) {
          const connector = this.drawService.drawLine(
            arrow.source,
            arrow.target
          );
          if (this.userSettings.showQuestionButtons) {
            this.bridgeButtonService.createButton(connector, this.arrowsCache);
          }
        }
      }
    });
  }

  refreshAll() {
    this.drawService.removeConnectors();

    Object.values(this.arrowsCache).forEach((arrow: Arrow) => {
      const source = this.stateService.findTable(arrow.source.tableName);
      const target = this.stateService.findTable(arrow.target.tableName);
      if (source.expanded && target.expanded) {
        const connector = this.drawService.drawLine(arrow.source, arrow.target);
        if (this.userSettings.showQuestionButtons) {
          this.bridgeButtonService.createButton(connector, this.arrowsCache);
        }
        this.drawService.drawLine(arrow.source, arrow.target);
      }
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

  removeAllArrows() {
    this.drawService.removeConnectors();
    this.deleteAll.next();
    this.arrowsCache = {};
  }

  removeSelectedArrows() {
    this.drawService.removeSelectedConnectors();
    this.deleteAll.next();
    this.arrowsCache = {};
  }

  generateMapping() {
    const mappingService = new MappingService(this.arrowsCache);
    return mappingService.generate();
  }

  hasConnection(table: ITable): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        return (
          connection.source.tableName === table.name ||
          connection.target.tableName === table.name
        );
      }).length > 0
    );
  }

  hasRowConnection(row: IRow): boolean {
    return (
      Object.values(this.arrowsCache).filter(connection => {
        return connection.source.id === row.id;
      }).length > 0
    );
  }

  findCorrespondingTables(table: ITable): string[] {
    const source = table.area === 'source' ? 'target' : 'source';
    const rows = Object.values(this.arrowsCache)
      .filter(connection => {
        return connection[table.area].tableName === table.name;
      })
      .map(arrow => arrow[source]);

    return uniqBy(rows, 'tableName').map(row => row.tableName);
  }

  resetAllMappings() {
    this.removeAllArrows();

    this.resetAllMappings$.next();
  }
}
