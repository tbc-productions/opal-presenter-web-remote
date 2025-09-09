import { Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { OpenLPService } from '../../services/openlp.service';
import { ServiceItem } from '../../interfaces/service-item.interface';
import { Slide } from '../../interfaces/slide.interface';

@Component({
  selector: 'app-lower-third',
  templateUrl: './lower-third.component.html',
  styleUrl: './lower-third.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class LowerThirdComponent implements OnInit, OnDestroy {
  openlpService: OpenLPService = inject(OpenLPService);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected settingsService: SettingsService = inject(SettingsService);
  
  @Input() embedded: boolean = false;
  serviceItem: ServiceItem = null;
  currentSlides: Slide[] = [];
  activeSlide: number = 0;
  fontSize: string = '29pt';
  fontFamily: string = null;

  private subscriptions: Subscription[] = [];
  serviceItemSubscription$: Subscription = null;

  ngOnInit(): void {
    const queryParamsSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.fontSize = params['font-size'];
        this.fontFamily = params['font-family'];
      }
    );
    this.updateCurrentSlides();
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      () => this.updateCurrentSlides()
    );
    this.subscriptions.push(queryParamsSubscription, stateChangedSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateCurrentSlides(): void {
    this.serviceItemSubscription$ = this.openlpService.getServiceItem().subscribe(
      (serviceItem: any) => {
        this.serviceItem = serviceItem;
        if (serviceItem instanceof Array) {
          this.setNewSlides(serviceItem);
        } else {
          this.setNewSlides(serviceItem.slides);
        }
      }
    );
    this.subscriptions.push(this.serviceItemSubscription$);
  }

  setNewSlides(slides: Slide[]): void {
    if (slides.length === 0) {
      return;
    }
    this.currentSlides = slides;
    this.activeSlide = slides.findIndex(s => s.selected);
   }
}
