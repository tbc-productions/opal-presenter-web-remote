import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OpenLPService } from '../../openlp.service';
import { Slide } from '../../responses';
import { Observable } from 'rxjs';
import { StageViewComponent } from '../stage-view/stage-view.component';

@Component({
  selector: 'app-chord-view',
  templateUrl: './chord-view.component.html',
  styleUrls: ['./chord-view.component.scss', '../overlay.scss', './chordpro.scss'],
  encapsulation: ViewEncapsulation.None // needed for the chords to be displayed

})
export class ChordViewComponent extends StageViewComponent {
  // Map with the song id and transpose value so the chord-view remembers the value for each song
  songTransposeMap = new Map();
  // current songs transpose level
  transposeLevel = 0;
  currentSlide = 0;
  useNewTransposeEndpoint = this.openlpService.assertApiVersionMinimum(2, 2);

  updateCurrentSlides(serviceItemId: string, currentSlide: number): void {
    this.currentSlide = currentSlide;
    this.useNewTransposeEndpoint = this.openlpService.assertApiVersionMinimum(2, 2);
    this.serviceItemSubscription$?.unsubscribe();
    const newServiceItemTransposeLevel = this.songTransposeMap.get(serviceItemId);

    if (this.useNewTransposeEndpoint && newServiceItemTransposeLevel && (newServiceItemTransposeLevel !== 0)) {
      this.transposeLevel = newServiceItemTransposeLevel;
      this.serviceItemSubscription$ = this.openlpService
          .transposeSong(newServiceItemTransposeLevel, 'service_item')
          .subscribe(serviceItem => {
            this.serviceItem = serviceItem;
            if (serviceItem instanceof Array) {
              this.setNewSlides(serviceItem, currentSlide);
            }
            else {
              this.setNewSlides(serviceItem.slides, currentSlide);
              this.setNotes(serviceItem.notes);
            }
          });
    } else {
      if (this.useNewTransposeEndpoint) {
        this.songTransposeMap.set(serviceItemId, 0);
        this.transposeLevel = 0;
      }
      super.updateCurrentSlides(serviceItemId, currentSlide);
    }
  }

  setNewSlides(slides: Slide[], currentSlide: number): void {
    if (this.openlpService.assertApiVersionExact(2, 2)) {
      // API Version 2.2 released on OpenLP 3.0.2 contains a bug on which 'selected' is not set correctly
      // on Transponse Service Item response.
      if (slides[currentSlide]) {
        slides[currentSlide].selected = true;
      }
    }
    super.setNewSlides(slides, currentSlide);
    // if this song is already known
    if (this.songTransposeMap.has(this.serviceItem.id)) {
      const transposeLevel = this.songTransposeMap.get(this.serviceItem.id);
      if (transposeLevel) {
        if (!this.useNewTransposeEndpoint) {
          this.transposeChords();
        }
      } else {
        this.transposeLevel = this.songTransposeMap.get(this.serviceItem.id);
      }
    } else {
      this.songTransposeMap.set(this.serviceItem.id, 0);
      this.transposeLevel = 0;
    }
  }


  transposeUp(): void {
    if (this.songTransposeMap.has(this.serviceItem.id)) {
      const tmpTranspose = this.songTransposeMap.get(this.serviceItem.id) + 1;
      this.songTransposeMap.set(this.serviceItem.id, tmpTranspose);
    } else {
      this.songTransposeMap.set(this.serviceItem.id, 1);
    }
    this.transposeChords();
  }

  transposeDown(): void {
    if (this.songTransposeMap.has(this.serviceItem.id)) {
      const tmpTranspose = this.songTransposeMap.get(this.serviceItem.id) - 1;
      this.songTransposeMap.set(this.serviceItem.id, tmpTranspose);
    } else {
      this.songTransposeMap.set(this.serviceItem.id, -1);
    }
    this.transposeChords();
  }

  transposeChords(): void {
    const tmpTranspose = this.songTransposeMap.get(this.serviceItem.id);
    this.transposeLevel = tmpTranspose;
    if (this.useNewTransposeEndpoint) {
      this.updateCurrentSlides(this.serviceItem.id, this.currentSlide);
    } else {
      this.transposeChordsLegacy(tmpTranspose);
    }
  }

  transposeChordsLegacy(transposeLevel): void {
    this.openlpService.transposeSong(transposeLevel).subscribe(transposedLyrics => {
      // Replace the chords in the currentSlides with the returned transposed chords
      if (transposedLyrics instanceof Array) {
        for (let i = 0; i < transposedLyrics.length; ++i) {
          this.currentSlides[i] = {...this.currentSlides[i], chords: transposedLyrics[i].chords};
        }
      }
    });
  }
}
