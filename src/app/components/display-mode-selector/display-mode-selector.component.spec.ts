import { TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DisplayModeSelectorComponent } from './display-mode-selector.component';
import { DisplayMode } from '../../enums/display-mode.enum';
import { Display } from '../../models/display';

describe('DisplayModeSelectorComponent', () => {
  let component: DisplayModeSelectorComponent;
  let bottomSheetRef: any;

  beforeEach(() => {
    bottomSheetRef = { dismiss: vi.fn() };
    const display = { id: 1 } as unknown as Display;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: MatBottomSheetRef, useValue: bottomSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: display },
      ]
    });
    component = TestBed.runInInjectionContext(() => new DisplayModeSelectorComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the display mode enum', () => {
    expect(component.displayMode).toBe(DisplayMode);
  });

  it('should dismiss with the selected mode', () => {
    component.setMode(DisplayMode.Presentation);
    expect(bottomSheetRef.dismiss).toHaveBeenCalledWith(DisplayMode.Presentation);
  });
});
