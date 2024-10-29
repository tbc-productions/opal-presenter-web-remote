import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Slide } from '../../../interfaces/slide.interface';
import { OpenLPService } from '../../../services/openlp.service';

@Component({
  selector: 'openlp-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss', '../../no-items.scss'],
})

export class SlideListComponent implements OnInit, OnDestroy {
  slides: Slide[] = null;
  @Output() slideSelected = new EventEmitter<SlideListItem>();
  _subscription: Subscription;
  loading = false;

  constructor(private openlpService: OpenLPService) {
    this._subscription = openlpService.stateChanged$.subscribe(() =>
      this.fetchSlides()
    );
  }

  ngOnInit() {
    this.fetchSlides();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  onSlideSelected(slide: Slide, index: number) {
    this.slideSelected.emit({slide, index});
  }

  fetchSlides() {
    this.loading = true;
    this.openlpService.getServiceItem().subscribe({
      next: (serviceItem) => {
        this.loading = false;
        if (serviceItem instanceof Array) {
          this.slides = serviceItem;
        } else {
          this.slides = serviceItem.slides;
        }
      },
      complete: () => {
        setTimeout(() => this.scrollToCurrentItem(), 25);
      }
    });
  }

  scrollToCurrentItem() {
    document.querySelectorAll('openlp-slide-item .selected')[0]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

export interface SlideListItem {
  slide: Slide;
  index: number;
}
