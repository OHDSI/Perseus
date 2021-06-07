import { Component, OnInit } from '@angular/core';
import { BridgeService } from '../services/bridge.service';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../shared/base/base.component';
import { Router } from '@angular/router';
import { mainPageRouter } from '../app.constants';

@Component({
  selector: 'app-cdm',
  templateUrl: './cdm.component.html',
  styleUrls: ['./cdm.component.scss']
})
export class CdmComponent extends BaseComponent implements OnInit {

  currentUrl: string;

  constructor(private bridgeService: BridgeService,
              private router: Router) {
    super()
  }

  ngOnInit(): void {
    this.subscribeOnResize();

    this.subscribeOnUrlChange();
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
    const parseUrl = url => url.replace(`${mainPageRouter}/`, '')
    this.currentUrl = parseUrl(this.router.url)
    this.router.events
      .subscribe(() =>
        this.currentUrl = parseUrl(this.router.url)
      )
  }
}
