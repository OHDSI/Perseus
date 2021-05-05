import { Component, Inject } from '@angular/core';
import { authInjector } from '../../services/auth/auth-injector';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  loading = false

  constructor(private dialogRef: MatDialogRef<LogoutComponent>,
              @Inject(authInjector) private authService: AuthService) { }

  logout() {
    this.loading = true
    this.authService.logout()
      .pipe(
        finalize(() => {
          this.loading = false
          this.dialogRef.close()
        })
      )
      .subscribe(() => {})
  }

  onClose() {
    this.dialogRef.close()
  }
}
