import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { OpenLPService } from '../../services/openlp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  private dialogRef: MatDialogRef<LoginComponent> = inject<MatDialogRef<LoginComponent>>(MatDialogRef);
  private openlpService: OpenLPService = inject(OpenLPService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private subscriptions: Subscription[] = [];
  private titleCasePipe: TitleCasePipe = inject(TitleCasePipe);
  private translateService: TranslateService = inject(TranslateService);

  username: string;
  password: string;
  loginSucceededMessage: string;
  loginFailedMessage: string;

  ngOnInit(): void {
    const loginSucceededMessageSubscription = this.translateService.stream('LOGIN_SUCCEEDED').subscribe(
      (res: string) => {
        this.loginSucceededMessage = this.titleCasePipe.transform(res);
      }
    );
    const loginFailedMessageSubscription = this.translateService.stream('LOGIN_FAILED').subscribe(
      (res: string) => {
        this.loginFailedMessage = this.titleCasePipe.transform(res);
      }
    );
    this.subscriptions.push(loginSucceededMessageSubscription, loginFailedMessageSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  login(): void {
    this.openlpService.login({ username: this.username, password: this.password }).subscribe(
      {
        next: result => {
          this.openlpService.isLoggedInChanged$.emit(true);
          this.snackBar.open(this.loginSucceededMessage, null, { duration: 2000 });
          this.dialogRef.close(result);
        },
        error: () => this.snackBar.open(this.loginFailedMessage, null, { duration: 2000 })
      }
    );
  }
}
