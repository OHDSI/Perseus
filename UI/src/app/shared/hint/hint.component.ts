import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Hint, hints } from './hints';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss']
})
export class HintComponent implements OnInit, OnDestroy {

  @Input()
  key: string

  hint: Hint

  show = false

  width: string

  @ViewChild('hintIcon', {read: ElementRef})
  hintIcon: ElementRef

  @ViewChild('hintContent')
  hintContent: ElementRef

  clickOutsideUnsub: () => void

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.hint = hints[this.key]
    this.width = calculateWidth(this.hint.text)
  }

  ngOnDestroy(): void {
    if (this.clickOutsideUnsub) {
      this.clickOutsideUnsub()
    }
  }

  showHint() {
    if (this.show) {
      this.unsubOnClickOutside()
      this.show = false
    } else {
      this.show = true
      this.clickOutsideUnsub = this.renderer.listen('document', 'click', event => {
        const notClickedInside = !this.hintContent.nativeElement.contains(event.target)
        const notClickedOnHintIcon = !this.hintIcon.nativeElement.contains(event.target)

        if (notClickedInside && notClickedOnHintIcon) {
          this.unsubOnClickOutside()
          this.show = false
        }
      })
    }
  }

  private unsubOnClickOutside() {
    this.clickOutsideUnsub()
    this.clickOutsideUnsub = null
  }
}

function calculateWidth(text: string): string {
  const longestWordLength = Math.max(...text
    .split(' ')
    .map(s => s.length)
  ) * 4 // 4 - Char length
  return `${longestWordLength * 4}px` // 4 Words count
}
