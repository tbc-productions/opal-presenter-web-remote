import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StageViewComponent } from './stage-view.component';
import { OpenLPService } from '../../services/openlp.service';
import { SettingsService } from '../../services/settings.service';

describe('StageViewComponent', () => {
  let component: StageViewComponent;
  let openlpService: OpenLPService;
  let settingsService: SettingsService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    openlpService = {
      getServiceItem: vi.fn().mockReturnValue(of({ slides: [{ text: 'Verse 1', tag: 'Verse', selected: true }] })),
      getServiceItems: vi.fn().mockReturnValue(of([{ id: '1', title: 'Next song', notes: '', plugin: 'songs', selected: false, is_valid: true, slides: [] }] as any)),
      stateChanged$: of({ item: '', slide: 0 }),
    } as unknown as OpenLPService;
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
        { provide: OpenLPService, useValue: openlpService },
        { provide: SettingsService, useValue: settingsService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        { provide: ActivatedRoute, useValue: {} },
      ]
    });
    component = TestBed.runInInjectionContext(() => new StageViewComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update tags from slides', () => {
    component.setNewSlides([
      { text: 'Verse 1', tag: 'Verse', selected: true, html: '', chords: '', lines: [], first_slide_of_tag: false, img: '' } as any,
      { text: 'Verse 2', tag: 'Verse', selected: false, html: '', chords: '', lines: [], first_slide_of_tag: false, img: '' } as any
    ], 0);
    expect(component.tags.length).toBe(1);
  });
});
