import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../openlp.service';
import { PageTitleService } from '../../page-title.service';
import { SlideListItem } from './slide-list/slide-list.component';

@Component({
  selector: 'openlp-slides',
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.scss',
})

export class SlidesComponent {
  constructor(
    protected pageTitleService: PageTitleService,
    protected openlpService: OpenLPService,
    private translateService: TranslateService) {
    this.translateService.get('SLIDES').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
  }

  onSlideSelected(item: SlideListItem) {
    this.openlpService.setSlide(item.index).subscribe();
  }
}
