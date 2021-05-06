import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../../services/auth/auth-state.service';

@Component({
  selector: 'app-link-expired',
  templateUrl: './link-expired.component.html',
  styleUrls: [
    './link-expired.component.scss',
    '../auth.component.scss'
  ]
})
export class LinkExpiredComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authStateService: AuthStateService) {
  }

  get linkType() {
    return this.authStateService.state
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter(params => !!params['linkType'])
      )
      .subscribe(params => {
        this.authStateService.state = params['linkType']
        this.router.navigate([])
      })
  }

  ngOnDestroy() {
    this.authStateService.state = null;
  }
}
