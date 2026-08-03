import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChordViewComponent } from './chord-view.component';
import { OpenLPService } from '../../services/openlp.service';
import { SettingsService } from '../../services/settings.service';

describe('ChordViewComponent', () => {
  let component: ChordViewComponent;
  let openlpService: OpenLPService;
  let settingsService: SettingsService;
  let changeDetectorRef: { detectChanges: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    openlpService = {
      assertApiVersionMinimum: vi.fn().mockReturnValue(true),
      assertApiVersionExact: vi.fn().mockReturnValue(true),
      transposeSong: vi.fn().mockReturnValue(of([])),
      getServiceItem: vi.fn().mockReturnValue(of({ slides: [] })),
      getServiceItems: vi.fn().mockReturnValue(of([])),
      stateChanged$: of({ item: '', slide: 0 }),
    } as unknown as OpenLPService;

    settingsService = {
      get: vi.fn().mockReturnValue(100),
      onPropertyChanged: vi.fn().mockReturnValue(of(100)),
    } as unknown as SettingsService;

    changeDetectorRef = { detectChanges: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: SettingsService, useValue: settingsService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        { provide: ActivatedRoute, useValue: {} },
      ]
    });
    component = TestBed.runInInjectionContext(() => new ChordViewComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transpose the chord map upward', () => {
    component.serviceItem = { id: 'song-1' } as any;
    component.transposeUp();
    expect(component.songTransposeMap.get('song-1')).toBe(1);
  });
});
