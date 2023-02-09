import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Slide } from '../../responses';
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
  stageProperty = 'chords';


  setNewSlides(slides: Slide[]): void {
    super.setNewSlides(slides);
    // if this song is already known
    if (this.songTransposeMap.has(this.serviceItem.id)) {
      if (this.songTransposeMap.get(this.serviceItem.id) !== 0) {
        this.transposeChords();
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
    this.openlpService.transposeSong(tmpTranspose).subscribe(transposedLyrics => {
      // Replace the chords in the currentSlides with the returned transposed chords
      if (transposedLyrics instanceof Array) {
        for (let i = 0; i < transposedLyrics.length; ++i) {
          this.currentSlides[i] = {...this.currentSlides[i], chords: transposedLyrics[i].chords};
        }
      }
    });
  }
}
