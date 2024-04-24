import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenLPService } from '../../openlp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  constructor(private dialogRef: MatDialogRef<LoginComponent>, private openlpService: OpenLPService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    // Do nothing
  }

  performLogin() {
    this.openlpService.login({username: this.username, password: this.password}).subscribe(
      result => {
        this.snackBar.open('Successfully logged in', '', {duration: 2000});
        this.dialogRef.close(result);
      },
      () => this.snackBar.open('Login failed', '', {duration: 2000})
    );
  }
}
