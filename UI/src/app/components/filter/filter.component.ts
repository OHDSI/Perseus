import { Component, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements AfterViewInit, OnDestroy {
  private listener: () => void;

  constructor(private overlay: OverlayRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.listener = this.renderer.listen(this.overlay.backdropElement, 'click', () => this.close());
  }

  ngOnDestroy() {
    this.listener();
  }

  close() {
    this.overlay.detach();
  }

}
