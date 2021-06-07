import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTextWidth]',
  exportAs: 'textWidth'
})
export class TextWidthDirective implements AfterViewInit {

  @Input()
  value: string

  @Input()
  tooltipDisabled = true

  @Input()
  maxWidth = 80

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  get width() {
    return this.el.nativeElement.offsetWidth
  }

  get innerHtml() {
    return this.el.nativeElement.innerHTML
  }

  set innerHtml(value: string) {
    this.el.nativeElement.innerHTML = value
  }

  ngAfterViewInit(): void {
    const value = this.innerHtml || this.value
    let excludeCount = 3
    while (this.width > this.maxWidth) {
      this.innerHtml = value.substr(0, value.length - excludeCount) + '...'
      excludeCount++
    }
    if (excludeCount > 3) {
      setTimeout(() => this.tooltipDisabled = false)
    }
  }
}
