import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { PageTitleService } from '../../services/page-title.service';
import { OpenLPService } from '../../services/openlp.service';

@Component({
    selector: 'openlp-alert',
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    providers: [OpenLPService],
    standalone: false
})

export class AlertComponent implements OnInit, OnDestroy {
  private pageTitleService: PageTitleService = inject(PageTitleService);
  private openlpService: OpenLPService = inject(OpenLPService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private subscriptions: Subscription[] = [];
  private titleCasePipe: TitleCasePipe = inject(TitleCasePipe);
  private translateService: TranslateService = inject(TranslateService);

  public alert: string = '';
  public alertMessage: string = '';

  ngOnInit(): void {
    const changePageTitleSubscription = this.translateService.stream('ALERTS').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    const alertSubmittedMessageSubscription = this.translateService.stream('ALERT_SUBMITTED').subscribe(
      (res: string) => {
        this.alertMessage = this.titleCasePipe.transform(res);
      }
    );
    this.subscriptions.push(changePageTitleSubscription, alertSubmittedMessageSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSubmit(): void {
    this.openlpService.showAlert(this.alert).subscribe(
      () => this.snackBar.open(this.alertMessage, '', { duration: 2000 })
    );
  }
}
