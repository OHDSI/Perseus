import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { BridgeService } from 'src/app/services/bridge.service';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { Area } from '../../models/area';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() area: Area;
  @Input() table: ITable;
  @Input() row: IRow;
  @Output() refreshPanel: EventEmitter<any> = new EventEmitter();
  @Output() addToGroup: EventEmitter<any> = new EventEmitter();
  @Output() reorderRows: EventEmitter<any> = new EventEmitter();
  @Input() mappingConfig: any;
  @Input() group: IRow;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private bridgeService: BridgeService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'draggable',
      'true'
    );
    this.zone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener(
        'dragover',
        this.onDragOver.bind(this)
      );
    });


  }

  @HostListener('dragstart', [ '$event' ])
  onDragStart(e: DragEvent) {

    const element: any = e.currentTarget;
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.draggedRowIndex = this.table.rows.findIndex(selectedRow => selectedRow.name === row.name);
      this.bridgeService.draggedRowY = e.clientY;

      if (this.area === 'source') {
        this.bridgeService.sourceRow = row;
        this.bridgeService.sourceRow.htmlElement.classList.add('drag-start');
      }
      if (this.area === 'target') {
        this.bridgeService.targetRow = row;
        this.bridgeService.targetRow.htmlElement.classList.add('drag-start');
      }
    }
  }

  onDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();

    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove(this.bridgeService.draggedRowClass);
    }

    if (this.bridgeService.targetRow) {
      this.bridgeService.targetRow.htmlElement.classList.remove(this.bridgeService.draggedRowClass);
    }

    if (e.currentTarget.nodeName === 'TR') {
      const row = e.currentTarget;
      const targetRow = this.table.rows.find(item => `${this.area}-${item.name}` === row.id);
      const classToAdd = (this.area === 'source' && this.bridgeService.sourceRow && !this.bridgeService.targetRow
        || this.area === 'target' && this.bridgeService.targetRow && !this.bridgeService.sourceRow) &&
        (!targetRow.grouppedFields || !targetRow.grouppedFields.length) ?
        this.bridgeService.draggedRowY < e.clientY ? 'drag-between-bottom' : 'drag-between-top' : 'drag-over';

      this.bridgeService.draggedRowY = e.clientY;

      if (!this.bridgeService.targetRowElement) {
        this.bridgeService.targetRowElement = row;
        this.bridgeService.targetRowElement.classList.add(classToAdd);
        return;
      }

      if (this.bridgeService.targetRowElement !== row) {
        this.bridgeService.targetRowElement.classList.remove(this.bridgeService.draggedRowClass);
        this.bridgeService.draggedRowClass = classToAdd;
        this.bridgeService.targetRowElement = row;
        this.bridgeService.targetRowElement.classList.add(classToAdd);
      }

    }

  }

  // TODO Dont manipulate htmlElement directly
  @HostListener('drop', [ '$event' ])
  onDrop(e: any) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
    }

    if (this.bridgeService.targetRow) {
      this.bridgeService.targetRow.htmlElement.classList.remove('drag-start');
    }

    const element = e.currentTarget;
    if (element) {
      const row = this.row;
      const targetRow = this.table.rows.find(item => `${this.area}-${item.name}` === element.id);

      if (targetRow.grouppedFields.length) {
        const rowToAdd = this.table.rows[this.bridgeService.draggedRowIndex];
        this.addToGroup.emit([targetRow, rowToAdd]);
        this.onDragEnd(e);
        return;
      }

      if (this.area === 'source' && this.bridgeService.sourceRow && !this.bridgeService.targetRow
      || this.area === 'target' && this.bridgeService.targetRow && !this.bridgeService.sourceRow) {
        this.reorderRows.emit(row);
        this.onDragEnd(e);
        return;
      }

      if (this.row.hasConstant || this.row.hasIncrement) {
        return;
      }

      row.htmlElement = element;
      this.bridgeService.targetRow = row;
      if (this.bridgeService.connect.canExecute()) {
        this.bridgeService.connect.execute(this.mappingConfig);
        this.onDragEnd(e);
      }
    }
  }

  @HostListener('dragend', [ '$event' ])
  onDragEnd(e: DragEvent) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
      this.bridgeService.sourceRow = null;
    }

    if (this.bridgeService.targetRow) {
      this.bridgeService.targetRow.htmlElement.classList.remove('drag-start');
      this.bridgeService.targetRow = null;
    }

    if (this.bridgeService.targetRowElement) {
      this.bridgeService.targetRowElement.classList.remove(this.bridgeService.draggedRowClass);
    }
  }

}
