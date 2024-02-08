import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageTitleService } from '../../page-title.service';
import { OpenLPService } from '../../openlp.service';

@Component({
  selector: 'openlp-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [OpenLPService]
})

export class AlertComponent {

  public alert: string;

  constructor(private pageTitleService: PageTitleService, private openlpService: OpenLPService,
              private snackBar: MatSnackBar) {
    pageTitleService.changePageTitle('Alerts');
  }

  onSubmit() {
    this.openlpService.showAlert(this.alert).subscribe(() => this.snackBar.open('Alert submitted', '', {duration: 2000}));
  }
}
