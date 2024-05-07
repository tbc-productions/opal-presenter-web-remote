import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { PageTitleService } from '../../page-title.service';
import { OpenLPService } from '../../openlp.service';

@Component({
  selector: 'openlp-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  providers: [OpenLPService]
})

export class AlertComponent {

  public alert: string;
  public alertMessage: string;

  constructor(
    private pageTitleService: PageTitleService,
    private openlpService: OpenLPService,
    private snackBar: MatSnackBar,
    private titleCasePipe: TitleCasePipe,
    private translateService: TranslateService) {
    this.translateService.stream('ALERTS').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
    this.translateService.stream('ALERT_SUBMITTED').subscribe(res => {
      this.alertMessage = this.titleCasePipe.transform(res);
    });
  }

  onSubmit() {
    this.openlpService.showAlert(this.alert).subscribe(
      () => this.snackBar.open(this.alertMessage, '', { duration: 2000 })
    );
  }
}
