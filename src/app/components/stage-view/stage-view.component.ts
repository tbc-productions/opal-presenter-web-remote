import { Component, OnInit } from '@angular/core';
import { OpenLPService } from '../../openlp.service';
import { ServiceItem, Slide } from '../../responses';

interface Tag {
  text: string;
  active: boolean;
}

@Component({
  selector: 'app-stage-view',
  templateUrl: './stage-view.component.html',
  styleUrls: ['./stage-view.component.scss', '../overlay.scss']
})
export class StageViewComponent implements OnInit {
  serviceItem: ServiceItem = null;
  notes = '';
  currentSlides: Slide[] = [];
  activeSlide = 0;
  tags: Tag[] = [];
  time = new Date();
  showNotes = true;

  constructor(public openlpService: OpenLPService) {
    setInterval(() => this.time = new Date(), 1000);
  }

  ngOnInit() {
    this.updateCurrentSlides();
    this.openlpService.stateChanged$.subscribe(item => this.updateCurrentSlides());
  }

  updateCurrentSlides(): void {
    this.openlpService.getServiceItem().subscribe(serviceItem => {
      this.serviceItem = serviceItem;
      if (serviceItem instanceof Array) {
        this.setNewSlides(serviceItem);
      }
      else {
        this.setNewSlides(serviceItem.slides);
        this.setNotes(serviceItem.notes);
      }
    });
  }

  get nextSlides(): Slide[] {
    return this.currentSlides.slice(this.activeSlide + 1);
  }

  setNewSlides(slides: Slide[]): void {
    if (slides.length === 0) {
      return;
    }
    this.currentSlides = slides;
    this.activeSlide = slides.findIndex(s => s.selected);
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
}
