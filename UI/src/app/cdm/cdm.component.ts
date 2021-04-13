import { Component, OnInit } from '@angular/core';
import { BridgeService } from '../services/bridge.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ICON_NAMES } from './icons';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';
import { mainPageRouter } from '../app.constants';

@Component({
  selector: 'app-cdm',
  templateUrl: './cdm.component.html',
  styleUrls: ['./cdm.component.scss']
})
export class CdmComponent extends BaseComponent implements OnInit {

  currentUrl = 'comfy';

  constructor(private bridgeService: BridgeService,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private router: Router) {
    super()
  }

  ngOnInit(): void {
    this.addIcons();

    this.subscribeOnResize();

    this.subscribeOnUrlChange();
  }

  private addIcons() {
    ICON_NAMES.forEach(key => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/${key}.svg`)
      );
    });
  }

  private subscribeOnResize() {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(50)
      )
      .subscribe(() => {
        this.bridgeService.refreshAll();
      });
  }

  private subscribeOnUrlChange() {
    this.router.events
      .subscribe(() =>
        this.currentUrl = this.router.url.replace(`${mainPageRouter}/`, '')
      )
  }
}
