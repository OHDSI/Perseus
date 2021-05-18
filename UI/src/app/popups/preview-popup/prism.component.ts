import { AfterViewInit, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

@Component({
  selector: 'prism-block',
  template: '',
})
export class PrismComponent implements AfterViewInit {
  @Input() code: string;
  @Input() language: string;
  private preNode: Node;
  private codeNode: Node;
  private nativeElement: Node;

  ngAfterViewInit() {
    this.preNode = this.renderer.createElement('pre');
    this.codeNode = this.renderer.createElement('code');
    this.renderer.addClass(this.codeNode, `language-${this.language}`);
    this.renderer.appendChild(this.nativeElement, this.preNode);
    this.renderer.appendChild(this.preNode, this.codeNode);
    this.codeNode.textContent = this.code;
    Prism.highlightElement(this.codeNode);
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }
}
