import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";

import { IRow } from "src/app/models/row";
import { ITable } from "src/app/models/table";
import { OverlayService } from "src/app/services/overlay/overlay.service";
import { CommentPopupComponent } from "src/app/components/popaps/comment-popup/comment-popup.component";
import { BridgeService, IConnection } from "src/app/services/bridge.service";
import { OverlayConfigOptions } from "src/app/services/overlay/overlay-config-options.interface";
import { AddConstantPopupComponent } from "../../popaps/add-constant-popup/add-constant-popup.component";
import { ConceptService } from "../../comfy/services/concept.service";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../base/base.component";
import { IConnector } from "src/app/models/interface/connector.interface";

@Component({
  selector: "app-panel-table",
  templateUrl: "./panel-table.component.html",
  styleUrls: ["./panel-table.component.scss"]
})
export class PanelTableComponent extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() table: ITable;
  @Input() tabIndex: any;
  @Input() displayedColumns: string[];

  @Output() openTransform = new EventEmitter<any>();

  @ViewChild("htmlElement", { read: ElementRef }) element: HTMLElement;

  get rows() {
    return this.table.rows;
  }

  get area() {
    return this.table.area;
  }

  get totalRowsNumber() {
    return this.table.rows.length;
  }

  get visibleRowsNumber() {
    return this.table.rows.filter((row: IRow) => row.visible).length;
  }

  get visibleRows() {
    return this.rows.filter((row: IRow) => row.visible);
  }

  connectorTypeLabel = new Map<string, string>();

  constructor(
    private bridgeService: BridgeService,
    private conceptService: ConceptService,
    private overlayService: OverlayService,
    private renderer: Renderer2
  ) {
    super();
  }

  private rowConnections = {};

  ngOnChanges() {
    Object.values(this.bridgeService.arrowsCache).forEach(connection => {
      if (
        this.table.name.toUpperCase() !==
        connection.target.tableName.toUpperCase()
      ) {
        //this.HideConnectorPin(connection);
        //this.ShowConnectorPin(connection);
      }
    });
  }

  ngOnInit(): void {
    this.bridgeService.deleteAll
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        // Object.keys(this.bridgeService.arrowsCache).forEach(key => {
        //   this.bridgeService.arrowsCache[key].source.htmlElement.classList.remove(
        //     'row-has-a-link-true'
        //   );
        // });

        this.rowConnections = {};
      });

    this.bridgeService.connection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        this.AddConnection(connection);
        this.ShowConnectorPin(connection);
        this.ShowConnectorPinLabel(connection);
      });

    this.bridgeService.removeConnection
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(connection => {
        this.HideConnectorPin(connection);
        this.HideConnectorPinLabel(connection);
      });

    Object.values(this.bridgeService.arrowsCache).forEach(connection => {
      this.ShowConnectorPinLabel(connection);
    });
  }

  ngAfterViewInit() {
    Object.values(this.bridgeService.arrowsCache).forEach(connection => {
      this.ShowConnectorPin(connection);
    });
  }

  AddConnection(connection: IConnection) {
    this.rows.forEach(row => {
      if (
        row.tableId === connection[this.table.area].tableId &&
        row.id === connection[this.table.area].id
      ) {
        this.rowConnections[row.key] = true;
      }
    });
  }

  ShowConnectorPin(connection: IConnection) {
    const rowId = connection.source.htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName("connector-pin");
    if (
      collection.length > 0 //&& this.bridgeService.isRowConnectedToTable(connection, this.table)
    ) {
      this.renderer.removeClass(collection[0], "hide");
    }
  }

  HideConnectorPin(connection: IConnection) {
    const rowId = connection.source.htmlElement.attributes.id.nodeValue;
    const element = document.getElementById(rowId);
    const collection = element.getElementsByClassName("connector-pin");
    if (
      collection.length > 0
      //&& !this.bridgeService.isRowConnectedToTable(connection, this.table)
    ) {
      this.renderer.addClass(collection[0], "hide");
    }
  }

  ShowConnectorPinLabel(connection: IConnection) {
    if (!this.connectorTypeLabel.has(connection.source.name)) {
      if (this.conceptService.isConcept(connection.connector)) {
        this.connectorTypeLabel.set(connection.source.name, "L");
      } else {
        this.connectorTypeLabel.set(connection.source.name, "T");
      }
    }
  }

  HideConnectorPinLabel(connection: IConnection) {
    if (this.connectorTypeLabel.has(connection.source.name)) {
      this.connectorTypeLabel.delete(connection.source.name);
    }
  }

  isRowHasConnection(row: IRow): boolean {
    if (typeof this.rowConnections[row.key] === "undefined") {
      return false;
    } else {
      return this.rowConnections[row.key];
    }
  }

  openCommentDialog(anchor: HTMLElement, row: IRow) {
    const component = CommentPopupComponent;

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: "custom-backdrop",
      positionStrategyFor: `comments-${this._getArea()}`,
      payload: row
    };

    const overlayRef = this.overlayService.open(
      dialogOptions,
      anchor,
      component
    );
  }

  openConstantDialog(anchor: HTMLElement, row: IRow) {
    if (!this.isRowHasConnection(row)) {
      const component = AddConstantPopupComponent;
      const value = { value: row.constant };

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: "custom-backdrop",
        positionStrategyFor: `comments-${this._getArea()}`,
        payload: value
      };

      const overlayRef = this.overlayService.open(
        dialogOptions,
        anchor,
        component
      );

      overlayRef.close$.subscribe(ok => {
        row.constant = value.value;
        if (row.constant) {
          this.bridgeService.addConstant.execute(row);
        }
      });
    }
  }

  onTransformDialogOpen(event: any, row: IRow, element: any) {
    event.stopPropagation();
    this.openTransform.emit({ row, element });
  }

  hasComment(row: IRow) {
    return row.comments.length;
  }

  setActiveRow(event: any, row: IRow) {
    event.stopPropagation();
  }

  selectTableRow(event: any, row: IRow) {
    event.stopPropagation();

    if (row.htmlElement) {
      const rowId = row.htmlElement.attributes.id.nodeValue;
      row.htmlElement = document.getElementById(rowId);

      row.selected = !row.selected;

      if (row.selected && row.htmlElement) {
        this.renderer.setAttribute(row.htmlElement, "selected", "true");
      } else {
        this.renderer.removeAttribute(row.htmlElement, "selected");
      }

      Object.values(this.bridgeService.arrowsCache)
        .filter(connection => {
          return connection[row.area].id === row.id;
        })
        .forEach(connection => {
          if (row.selected) {
            connection.connector.select();
          } else {
            connection.connector.deselect();
          }
        });
    }
  }

  private _getArea() {
    return this.table.area;
  }
}
