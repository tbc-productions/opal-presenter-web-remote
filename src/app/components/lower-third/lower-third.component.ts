import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SettingsProperties, SettingsService } from 'src/app/settings.service';
import { OpenLPService } from '../../openlp.service';
import { ServiceItem, Slide } from '../../responses';

@Component({
  selector: 'app-lower-third',
  templateUrl: './lower-third.component.html',
  styleUrls: ['./lower-third.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LowerThirdComponent implements OnInit, OnDestroy {
  @Input() embedded = false;
  serviceItem: ServiceItem = null;
  currentSlides: Slide[] = [];
  activeSlide = 0;
  fontSize = '29pt';
  fontFamily = null;

  serviceItemSubscription$: Subscription = null;

  constructor(
    public openlpService: OpenLPService,
    protected route: ActivatedRoute,
    protected settingsService: SettingsService,
    protected ref: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      this.fontSize = params['font-size'];
      this.fontFamily = params['font-family'];
    });
  }

  ngOnInit() {
    this.updateCurrentSlides(null, null);
    this.openlpService.stateChanged$.subscribe(item => this.updateCurrentSlides(item.item, item.slide));
  }

  ngOnDestroy(): void {
  }

  updateCurrentSlides(serviceItemId: string, currentSlide: number): void {
    this.serviceItemSubscription$?.unsubscribe();
    this.serviceItemSubscription$ = this.openlpService.getServiceItem().subscribe(serviceItem => {
      this.serviceItem = serviceItem;
      if (serviceItem instanceof Array) {
        this.setNewSlides(serviceItem, currentSlide);
      }
      else {
        this.setNewSlides(serviceItem.slides, currentSlide);
       }
    });
  }

  setNewSlides(slides: Slide[], currentSlide: number): void {
    if (slides.length === 0) {
      return;
    }
    this.currentSlides = slides;
    this.activeSlide = slides.findIndex(s => s.selected);
   }

}
