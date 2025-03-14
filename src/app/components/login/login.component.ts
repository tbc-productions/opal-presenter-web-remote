import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../services/openlp.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {
  username: string;
  password: string;
  loginSucceededMessage: string;
  loginFailedMessage: string;
  
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private openlpService: OpenLPService,
    private snackBar: MatSnackBar,
    private titleCasePipe: TitleCasePipe,
    private translateService: TranslateService) {
    this.translateService.stream('LOGIN_SUCCEEDED').subscribe(res => {
      this.loginSucceededMessage = this.titleCasePipe.transform(res);
    });
    this.translateService.stream('LOGIN_FAILED').subscribe(res => {
      this.loginFailedMessage = this.titleCasePipe.transform(res);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  login() {
    this.openlpService.login({ username: this.username, password: this.password }).subscribe({
      next: result => {
        this.openlpService.isLoggedInChanged$.emit(true);
        this.snackBar.open(this.loginSucceededMessage, null, { duration: 2000 });
        this.dialogRef.close(result);
      },
      error: () => this.snackBar.open(this.loginFailedMessage, null, { duration: 2000 })
    });
  }
}
