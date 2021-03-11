import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { BridgeService } from './services/bridge.service';
import { BaseComponent } from './base/base.component';

const ICON_NAMES = [
  'CDM_version',
  'folder',
  'folder_2',
  'mapping',
  'reset',
  'save',
  'help',
  'new_mapping',
  'edit',
  'delete',
  'scan_data',
  'search',
  'convert_data',
  'generate_and_save',
  'generate_fake',
  'generate_report',
  'generate_word',
  'generate_html',
  'generate_md',
  'quality_check',
  'vocabulary'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent extends BaseComponent implements OnInit {

  constructor(
    private bridgeService: BridgeService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.addIcons();

    this.subscribeOnResize();
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
}

export type OpenMappingDialog = 'open' | 'save';
