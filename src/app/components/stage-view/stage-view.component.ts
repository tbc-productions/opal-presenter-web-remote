import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { SettingsProperties, SettingsService } from '../../services/settings.service';
import { OpenLPService } from '../../services/openlp.service';
import { ServiceItem } from '../../interfaces/service-item.interface';
import { Slide } from '../../interfaces/slide.interface';

interface Tag {
  text: string;
  active: boolean;
}

@Component({
  selector: 'app-stage-view',
  templateUrl: './stage-view.component.html',
  styleUrls: ['./stage-view.component.scss', '../overlay.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class StageViewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  openlpService: OpenLPService = inject(OpenLPService);
  protected changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected settingsService: SettingsService = inject(SettingsService);
  
  @Input() embedded: boolean = false;
  serviceItem: ServiceItem = {} as ServiceItem;
  nextServiceItemTitle: string = '';
  notes: string = '';
  currentSlides: Slide[] = [];
  activeSlide: number = 0;
  tags: Tag[] = [];
  time: Date = new Date();
  showNotes: boolean = true;
  fontScale: number = 1;

  serviceItemSubscription$: Subscription | null = null;
  fontScaleSubscription$: Subscription | null = null;

  stageProperty: string = 'stage';

  constructor() {
    setInterval(() => this.time = new Date(), 1000);
  }

  nextSlides: Slide[] = [];

  ngOnInit(): void {
    this.updateCurrentSlides('', 0);
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      (item: { item: string; slide: number }) => this.updateCurrentSlides(item.item, item.slide)
    );
    this.fontScale = this.settingsService.get(
      this.stageProperty + 'FontScale' as keyof SettingsProperties
    ) as number / 100;

    this.fontScaleSubscription$ = this.settingsService
      .onPropertyChanged(this.stageProperty + 'FontScale' as keyof SettingsProperties)
      .subscribe(
        (value: number) => {
          this.fontScale = value / 100;
          this.changeDetectorRef.detectChanges();
        }
      );
    this.subscriptions.push(stateChangedSubscription, this.fontScaleSubscription$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateCurrentSlides(_serviceItemId: string, currentSlide: number): void {
    this.serviceItemSubscription$?.unsubscribe();
    this.serviceItemSubscription$ = this.openlpService.getServiceItem().subscribe(
      (currentServiceItem: any) => {
        this.serviceItem = currentServiceItem;
        if (currentServiceItem instanceof Array) {
          this.setNewSlides(currentServiceItem, currentSlide);
        } else {
          this.setNewSlides(currentServiceItem.slides, currentSlide);
          this.setNotes(currentServiceItem.notes);
        }
        this.getNextServiceItemTitle();
        this.changeDetectorRef.detectChanges();
      }
    );
    this.subscriptions.push(this.serviceItemSubscription$);
  }

  getNextServiceItemTitle(): void {
    this.nextServiceItemTitle = '';
    let doStoreServiceItemTitle: boolean = false;
    const getServiceItemsSubscription = this.openlpService.getServiceItems().subscribe(
      (serviceItems: any) => {
        serviceItems.forEach(
            (serviceItem: any) => {
              if (doStoreServiceItemTitle) {
                this.nextServiceItemTitle = serviceItem.title;
                doStoreServiceItemTitle = false;
              }
              if (serviceItem.id === this.serviceItem.id) {
                doStoreServiceItemTitle = true;
              }
            }
        );
        this.changeDetectorRef.detectChanges();
      }
    );
    this.subscriptions.push(getServiceItemsSubscription);
  }

  setNewSlides(slides: Slide[], _currentSlide: number): void { /* eslint-disable-line @typescript-eslint/no-unused-vars */
    if ((slides?.length ?? 0) === 0) {
      return;
    }
    this.currentSlides = slides;
    this.activeSlide = slides.findIndex(s => s.selected);
    this.nextSlides = this.currentSlides.slice(this.activeSlide + 1);
    this.updateTags();
  }

  setNotes(notes: string): void {
    this.notes = notes;
  }

  /**
   * This method updates the tags from the current slides.
   *
   * We add a tag as soon as we know we need it.
   * So we start with the first tag and on each tag change we push the new one.
   *
   * If we find the same tag, we check to see if the current slide is a repition.
   * In case of a repetition we also add a new tag.
   *
   * TODO This approach should work for most cases. It is a primary candidate for a test :-)
   */
  updateTags(): void {
    this.tags = [];
    this.tags.push({text: this.currentSlides[0].tag, active: this.currentSlides[0].selected});
    let lastIndex = 0;
    loop:
    for (let index = 1; index < this.currentSlides.length; ++index) {
      let foundActive = false;
      if (this.currentSlides[index].tag === this.currentSlides[lastIndex].tag) {
        for (let i = 0; i < index - lastIndex; ++i) {
          foundActive = foundActive || this.currentSlides[index + i].selected;

          // they are different, stop checking and continue outer loop
          if (this.currentSlides[lastIndex + i].text !== this.currentSlides[index + i].text) {
            // Since we are collapsing tags, we make sure to mark the tag active, if any of the collapsed tags were active
            if (foundActive) {
              this.tags[this.tags.length - 1].active = foundActive;
            }
            continue loop;
          }
        }
      }
      // either the tags differed, or we found a repitition. Either way add a tag
      this.tags.push({text: this.currentSlides[index].tag, active: this.currentSlides[index].selected});
      this.currentSlides[index].first_slide_of_tag = true;
      lastIndex = index;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
