import { Directive, ElementRef, Renderer2, ViewChild, HostListener, Input } from '@angular/core';
import { MatMenuTrigger, MatMenuPanel } from '@angular/material';
import { FlexibleConnectedPositionStrategy, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';

@Directive({
  selector: '[appCommentPopup]'
})
export class CommentPopupDirective {
  overlayRef: OverlayRef;
  overlayConf: OverlayConfig;
  dropDown: HTMLElement;
  overlayPositionBox: HTMLElement;
  menu: MatMenuPanel;
  button: HTMLElement;
  buttonWidth: number;
  buttonLeft: number;
  buttonBottom: number;
  arrowDiv: HTMLDivElement;

  @Input('popup-trigger') private menuTrigger: MatMenuTrigger;

  constructor(private elementRef: ElementRef, private menuButton: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event'])
  onclick(e) {
    this.setVariables();
    this.menuTrigger['_openedBy'] = e.button === 0 ? 'mouse' : null;
    this.overrideMatMenu();

    this.dropDown = this.overlayRef.overlayElement.children[0].children[0] as HTMLElement;
    this.overlayPositionBox = this.overlayRef.hostElement;

    setTimeout(() => {
      this.styleDropDown(this.dropDown);
      this.setOverlayPosition(this.dropDown, this.overlayPositionBox);
      this.openMenu();
    })
  }

  private setVariables() {
    const config = this.menuTrigger['_getOverlayConfig']();
    this.menuTrigger['_overlayRef'] = this.menuTrigger['_overlay'].create(config);
    this.overlayRef = this.menuTrigger['_overlayRef'];
    this.overlayConf = this.overlayRef.getConfig();
    this.overlayRef.keydownEvents().subscribe();
    this.menu = this.menuTrigger.menu;
    this.setButtonVars();
  }

  private setButtonVars() {
    this.button = this.menuButton.nativeElement;
    this.buttonWidth = this.button.getBoundingClientRect().width;
    this.buttonLeft = this.button.getBoundingClientRect().left;
    this.buttonBottom = this.button.getBoundingClientRect().bottom;
  }

  private overrideMatMenu() {
    let strat = this.overlayConf.positionStrategy as FlexibleConnectedPositionStrategy;
    this.menuTrigger['_setPosition'](strat);
    strat.positionChanges.subscribe(() => {
      this.setButtonVars();
      this.setOverlayPosition(this.dropDown, this.overlayPositionBox);
    })
    this.overlayConf.hasBackdrop = this.menu.hasBackdrop == null ? !this.menuTrigger.triggersSubmenu() : this.menu.hasBackdrop;
    this.overlayRef.attach(this.menuTrigger['_getPortal']());

    if (this.menu.lazyContent) {
      this.menu.lazyContent.attach()
    }

    this.menuTrigger['_closeSubscription'] = this.menuTrigger['_menuClosingActions']().subscribe(() => {
      this.menuTrigger.closeMenu();
      setTimeout(() => {
        this.renderer.removeChild(this.button, this.arrowDiv);
      }, 75)

    });
    this.menuTrigger['_initMenu']();
  }

  private styleDropDown(dropDown: HTMLElement) {
    this.arrowDiv = this.renderer.createElement('div');
    this.renderer.addClass(this.arrowDiv, 'dialog-arrow');
    this.renderer.appendChild(this.button, this.arrowDiv);
    this.renderer.setStyle(this.arrowDiv, 'left', (this.buttonWidth / 2) - 10 + 'px')
    this.renderer.setStyle(this.renderer.parentNode(dropDown), 'transform-origin', 'center top 0px');
  }

  private setOverlayPosition(dropDown: HTMLElement, overlayPositionBox: HTMLElement) {
    let dropDownleft = ((this.buttonWidth / 2 + this.buttonLeft) - dropDown.offsetWidth / 2);

    this.renderer.setStyle(overlayPositionBox, 'top', this.buttonBottom + 9 + 'px');
    this.renderer.setStyle(overlayPositionBox, 'left', dropDownleft + 'px');
    this.renderer.setStyle(overlayPositionBox, 'height', '100%');
  }

  private openMenu() {
    this.menuTrigger.menu['_startAnimation']();
  }
}
