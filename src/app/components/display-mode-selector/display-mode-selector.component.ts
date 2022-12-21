import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DisplayMode } from 'src/app/responses';


@Component({
    selector: 'openlp-display-mode-sheet',
    templateUrl: 'display-mode-selector.component.html',
    styleUrls: ['./display-mode-selector.component.scss']
  })
  export class DisplayModeSelectorComponent {
    // Make DisplayMode enum visible to html code
    DisplayMode = DisplayMode;

    constructor(private bottomSheetRef: MatBottomSheetRef<DisplayModeSelectorComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public displayMode: DisplayMode) {}

    setMode(mode: DisplayMode): void {
      this.bottomSheetRef.dismiss(mode);
      event.preventDefault();
    }
  }
