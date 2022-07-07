import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AuthFacadeService } from '@services/state/auth-facade.service';
import { loginRouter } from '@app/app.constants'
import { Router } from '@angular/router'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  loading = false

  constructor(private dialogRef: MatDialogRef<LogoutComponent>,
              private authService: AuthFacadeService,
              private router: Router) {}

  logout() {
    this.loading = true
    this.authService.logout()
      .pipe(
        finalize(() => {
          this.loading = false
          this.dialogRef.close()
        })
      )
      .subscribe(() => this.router.navigateByUrl(loginRouter))
  }

  onClose() {
    this.dialogRef.close()
  }
}
