import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../openlp.service';
import { PageTitleService } from '../../page-title.service';
import { ServiceItem } from '../../responses';

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
    this.translateService.get('SERVICE').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
  }
}
