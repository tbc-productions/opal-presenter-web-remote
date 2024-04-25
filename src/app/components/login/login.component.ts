import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../openlp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loginSucceededMessage: string;
  loginFailedMessage: string;
  
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private openlpService: OpenLPService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService) {
    this.translateService.stream('LOGIN_SUCCEEDED').subscribe(res => {
      this.loginSucceededMessage = res;
    });
    this.translateService.stream('LOGIN_FAILED').subscribe(res => {
      this.loginFailedMessage = res;
    });
  }

  ngOnInit() {
    // Do nothing
  }

  performLogin() {
    this.openlpService.login({username: this.username, password: this.password}).subscribe(
      result => {
        this.snackBar.open(this.loginSucceededMessage, '', {duration: 2000});
        this.dialogRef.close(result);
      },
      () => this.snackBar.open(this.loginFailedMessage, '', {duration: 2000})
    );
  }
}
