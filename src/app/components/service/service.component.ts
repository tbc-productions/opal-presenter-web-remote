import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { ServiceItem } from '../../interfaces/service-item.interface';

@Component({
  selector: 'openlp-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  standalone: false
})

export class ServiceComponent implements OnInit, OnDestroy {
  protected pageTitleService: PageTitleService = inject(PageTitleService);
  protected openlpService: OpenLPService = inject(OpenLPService);
  protected router: Router = inject(Router);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);

  onItemSelected(item: ServiceItem): void {
    if (item.is_valid) {
      this.openlpService.setServiceItem(item.id).subscribe();
      this.router.navigate(['slides']);
    }
  }

  ngOnInit(): void {
    const changePageTitleSubscription = this.translateService.stream('SERVICE').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    this.subscriptions.push(changePageTitleSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
