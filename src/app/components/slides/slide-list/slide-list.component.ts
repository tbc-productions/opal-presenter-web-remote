import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Slide } from '../../../responses';
import { OpenLPService } from '../../../openlp.service';
import { HotKeysService } from '../../../hotkeys.service';

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
  previousServiceItemId: string;
  isServiceItemChanged: boolean;

  constructor(private openlpService: OpenLPService, private hotKeysService: HotKeysService) {
    this._subscription = openlpService.stateChanged$.subscribe(_ =>
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
        }
        else {
          this.slides = serviceItem.slides;
          if (this.previousServiceItemId !== serviceItem.id) {
            this.isServiceItemChanged = true;
            this.previousServiceItemId = serviceItem.id;
          }
        }
      },
      complete: () => {
        if (this.isServiceItemChanged) {
          setTimeout(() => this.hotKeysService.scrollToCurrentItem('slide', window.scrollY === 0 ? 'center' : 'end'), 25);
          this.isServiceItemChanged = false;
        }
      }
    });
  }
}

export interface SlideListItem {
  slide: Slide;
  index: number;
}

