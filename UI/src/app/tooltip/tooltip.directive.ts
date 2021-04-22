import { Directive, HostListener, Input } from '@angular/core';
import { OverlayService } from '../services/overlay/overlay.service';
import { TooltipComponent } from './tooltip.component';
import { tooltips } from './tooltip';
import { OverlayConfigOptions } from '../services/overlay/overlay-config-options.interface';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  @Input()
  key: string

  private isClose = true

  constructor(private overlayService: OverlayService) {
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (this.isClose) {
      const options: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'tooltip-backdrop',
        payload: tooltips[this.key]
      }
      this.isClose = false
      this.overlayService
        .open(options, event.target, TooltipComponent)
        .afterClosed$
        .subscribe(() => this.isClose = true)
    }
  }
}
