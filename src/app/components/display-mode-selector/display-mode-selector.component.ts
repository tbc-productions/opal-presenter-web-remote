import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Display } from '../../models/display';
import { DisplayMode } from '../../enums/display-mode.enum';

@Component({
    selector: 'openlp-display-mode-sheet',
    templateUrl: 'display-mode-selector.component.html',
    styleUrl: './display-mode-selector.component.scss'
})
export class DisplayModeSelectorComponent {
  // Make DisplayMode enum visible in HTML template.
  displayMode = DisplayMode;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<DisplayModeSelectorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public display: Display) {}

  setMode(mode: DisplayMode): void {
    this.bottomSheetRef.dismiss(mode);
  }
}
