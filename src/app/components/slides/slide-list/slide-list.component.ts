import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Slide } from '../../../interfaces/slide.interface';
import { OpenLPService } from '../../../services/openlp.service';

@Component({
  selector: 'openlp-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss', '../../no-items.scss'],
  standalone: false
})

export class SlideListComponent implements OnInit, OnDestroy {
  private openlpService: OpenLPService = inject(OpenLPService);

  slides: Slide[] = null;
  @Output() slideSelected = new EventEmitter<SlideListItem>();
  private subscriptions: Subscription[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      () => this.fetchSlides()
    );
    this.subscriptions.push(stateChangedSubscription);
    this.fetchSlides();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSlideSelected(slide: Slide, index: number): void {
    this.slideSelected.emit({slide, index});
  }

  fetchSlides(): void {
    this.loading = true;
    const getServiceItemSubscription = this.openlpService.getServiceItem().subscribe({
      next: (serviceItem: any) => {
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
    this.subscriptions.push(getServiceItemSubscription);
  }

  scrollToCurrentItem(): void {
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
