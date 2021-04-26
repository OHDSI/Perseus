import { Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { hints } from './hints';
import { OverlayDialogRef, OverlayService } from '../../services/overlay/overlay.service';
import { HintOverlayComponent } from './hint-overlay/hint-overlay.component';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss']
})
export class HintComponent implements OnDestroy {

  @Input()
  key: string

  @ViewChild('hintIcon', {read: ElementRef})
  hintIcon: ElementRef

  private show = false

  private clickOutsideUnsub: () => void

  private hintOverlayRef: OverlayDialogRef;

  constructor(private renderer: Renderer2,
              private overlayService: OverlayService) {
  }

  ngOnDestroy(): void {
    if (this.clickOutsideUnsub) {
      this.clickOutsideUnsub()
    }
    if (this.hintOverlayRef) {
      this.hintOverlayRef.close()
    }
  }

  showHint() {
    if (this.show) {
      this.unsubOnClickOutside()
      this.closeHint()
    } else {
      this.openHint()
      this.clickOutsideUnsub = this.renderer.listen('document', 'click', this.onClick.bind(this))
    }
  }

  private openHint() {
    this.show = true
    this.hintOverlayRef = this.overlayService.open({
      disableClose: true,
      positionStrategyFor: 'hint',
      payload: hints[this.key]
    }, this.hintIcon.nativeElement, HintOverlayComponent);
  }

  private closeHint() {
    this.show = false
    this.hintOverlayRef.close()
    this.hintOverlayRef = null
  }

  private unsubOnClickOutside() {
    this.clickOutsideUnsub()
    this.clickOutsideUnsub = null
  }

  private onClick(event: MouseEvent) {
    const notClickedInside = !this.hintOverlayRef.overlayElement.contains(event.target as Element)
    const notClickedOnHintIcon = !this.hintIcon.nativeElement.contains(event.target)

    if (notClickedInside && notClickedOnHintIcon) {
      this.unsubOnClickOutside()
      this.closeHint()
    }
  }
}
