import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SettingsProperties, SettingsService } from 'src/app/settings.service';
import { OpenLPService } from '../../openlp.service';
import { ServiceItem, Slide } from '../../responses';

interface Tag {
  text: string;
  active: boolean;
}

@Component({
  selector: 'app-stage-view',
  templateUrl: './stage-view.component.html',
  styleUrls: ['./stage-view.component.scss', '../overlay.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StageViewComponent implements OnInit, OnDestroy {
  @Input() embedded = false;
  serviceItem: ServiceItem = null;
  nextServiceItemTitle = '';
  notes = '';
  currentSlides: Slide[] = [];
  activeSlide = 0;
  tags: Tag[] = [];
  time = new Date();
  showNotes = true;
  fontScale: number;

  serviceItemSubscription$: Subscription = null;
  fontScaleSubscription$: Subscription;

  stageProperty = 'stage';

  constructor(
    public openlpService: OpenLPService,
    protected route: ActivatedRoute,
    protected settingsService: SettingsService,
    protected ref: ChangeDetectorRef
  ) {
    setInterval(() => this.time = new Date(), 1000);
  }

  nextSlides: Slide[] = [];

  ngOnInit() {
    this.updateCurrentSlides(null, null);
    this.openlpService.stateChanged$.subscribe((item: { item: string; slide: number }) =>
      this.updateCurrentSlides(item.item, item.slide)
    );
    this.fontScale = this.settingsService.get(
      this.stageProperty + 'FontScale' as keyof SettingsProperties
    ) as number / 100;

    this.fontScaleSubscription$ = this.settingsService
      .onPropertyChanged(this.stageProperty + 'FontScale' as keyof SettingsProperties)
      .subscribe(value => {
        this.fontScale = value as number / 100;
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.fontScaleSubscription$?.unsubscribe();
  }

  updateCurrentSlides(_serviceItemId: string, currentSlide: number): void {
    this.serviceItemSubscription$?.unsubscribe();
    this.serviceItemSubscription$ = this.openlpService.getServiceItem().subscribe(currentServiceItem => {
      this.serviceItem = currentServiceItem;
      if (currentServiceItem instanceof Array) {
        this.setNewSlides(currentServiceItem, currentSlide);
      }
      else {
        this.setNewSlides(currentServiceItem.slides, currentSlide);
        this.setNotes(currentServiceItem.notes);
      }
      this.getNextServiceItemTitle();
    });
  }

  getNextServiceItemTitle(): void {
    this.nextServiceItemTitle = '';
    let doStoreServiceItemTitle = false;
    this.openlpService.getServiceItems().subscribe(serviceItems => {
      serviceItems.forEach((serviceItem) => {
        if (doStoreServiceItemTitle) {
          this.nextServiceItemTitle = serviceItem.title;
          doStoreServiceItemTitle = false;
        }
        if (serviceItem.id === this.serviceItem.id) {
          doStoreServiceItemTitle = true;
        }
      });
    });
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

  trackByIndex(index: number) {
    return index;
  }
}
