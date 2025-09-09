import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { SlideListItem } from './slide-list/slide-list.component';

@Component({
  selector: 'openlp-slides',
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.scss',
  standalone: false
})

export class SlidesComponent implements OnInit, OnDestroy {
  protected pageTitleService: PageTitleService = inject(PageTitleService);
  protected openlpService: OpenLPService = inject(OpenLPService);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);

  ngOnInit(): void {
    const changePageTitleSubscription = this.translateService.stream('SLIDES').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    this.subscriptions.push(changePageTitleSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSlideSelected(item: SlideListItem): void {
    this.openlpService.setSlide(item.index).subscribe();
  }
}
