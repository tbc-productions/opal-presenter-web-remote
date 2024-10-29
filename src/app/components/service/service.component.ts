import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { ServiceItem } from '../../interfaces/service-item.interface';

@Component({
  selector: 'openlp-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})

export class ServiceComponent {
  onItemSelected(item: ServiceItem) {
    if (item.is_valid) {
      this.openlpService.setServiceItem(item.id).subscribe();
      this.router.navigate(['slides']);
    }
  }

  constructor(
    protected pageTitleService: PageTitleService,
    protected openlpService: OpenLPService,
    protected router: Router,
    private translateService: TranslateService) {
    this.translateService.stream('SERVICE').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
  }
}
