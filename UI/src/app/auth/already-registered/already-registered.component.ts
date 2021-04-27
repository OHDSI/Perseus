import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-already-registered',
  templateUrl: './already-registered.component.html',
  styleUrls: [
    './already-registered.component.scss',
    '../auth.component.scss'
  ]
})
export class AlreadyRegisteredComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authStateService: AuthStateService) { }

  get email() {
    return this.authStateService.state
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter(params => !!params['email'])
      )
      .subscribe(params => {
        this.authStateService.state = params['email']
        this.router.navigate([])
      })
  }

  ngOnDestroy() {
    this.authStateService.state = null;
  }
}
