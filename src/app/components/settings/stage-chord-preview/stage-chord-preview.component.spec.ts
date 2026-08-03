import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StageChordPreviewComponent } from './stage-chord-preview.component';
import { SettingsService } from '../../../services/settings.service';

describe('StageChordPreviewComponent', () => {
  let component: StageChordPreviewComponent;
  let settingsService: SettingsService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    settingsService = {
      get: vi.fn().mockReturnValue(100),
      onPropertyChanged: vi.fn().mockReturnValue(of(100)),
    } as unknown as SettingsService;
    changeDetectorRef = {
      detectChanges: vi.fn(),
    } as unknown as ChangeDetectorRef;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
      { provide: SettingsService, useValue: settingsService },
      { provide: ChangeDetectorRef, useValue: changeDetectorRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new StageChordPreviewComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the font scale from settings', () => {
    component.ngOnInit();
    expect(component.fontScale).toBe(1);
  });
});
