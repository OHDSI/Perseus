import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

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
  maxWidth: number

  constructor(private el: ElementRef) {
  }

  get width() {
    return this.el.nativeElement.offsetWidth
  }

  get parent() {
    return this.el.nativeElement.parentElement
  }

  get innerHtml() {
    return this.el.nativeElement.innerHTML
  }

  set innerHtml(value: string) {
    this.el.nativeElement.innerHTML = value
  }

  ngAfterViewInit(): void {
    if (!this.maxWidth) {
      this.maxWidth = this.parent.offsetWidth
    }

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
