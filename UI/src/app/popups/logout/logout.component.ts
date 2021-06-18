import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AuthFacadeService } from '@services/state/auth-facade.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  loading = false

  constructor(private dialogRef: MatDialogRef<LogoutComponent>,
              private authService: AuthFacadeService) { }

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
