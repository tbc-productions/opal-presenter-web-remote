import { Component, inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Display } from '../../models/display';
import { DisplayMode } from '../../enums/display-mode.enum';

@Component({
  selector: 'openlp-display-mode-sheet',
  templateUrl: 'display-mode-selector.component.html',
  styleUrl: './display-mode-selector.component.scss',
  standalone: false
})
export class DisplayModeSelectorComponent {
  private bottomSheetRef: MatBottomSheetRef<DisplayModeSelectorComponent> = inject<MatBottomSheetRef<DisplayModeSelectorComponent>>(MatBottomSheetRef);
  display: Display = inject<Display>(MAT_BOTTOM_SHEET_DATA);

  // Make DisplayMode enum visible in HTML template.
  displayMode: typeof DisplayMode = DisplayMode;

  setMode(mode: DisplayMode): void {
    this.bottomSheetRef.dismiss(mode);
  }
}
