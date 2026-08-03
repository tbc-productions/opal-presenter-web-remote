import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LowerThirdComponent } from './lower-third.component';
import { OpenLPService } from '../../services/openlp.service';
import { SettingsService } from '../../services/settings.service';

describe('LowerThirdComponent', () => {
  let component: LowerThirdComponent;
  let openlpService: OpenLPService;
  let settingsService: SettingsService;
  let route: ActivatedRoute;

  beforeEach(() => {
    openlpService = {
      getServiceItem: vi.fn(),
      stateChanged$: of({}),
    } as unknown as OpenLPService;
    settingsService = {
      get: vi.fn(),
    } as unknown as SettingsService;
    route = {
      queryParams: of({}),
    } as unknown as ActivatedRoute;
    (openlpService.getServiceItem as any).mockReturnValue(of({ slides: [{ text: 'Verse 1', selected: true }] }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: SettingsService, useValue: settingsService },
        { provide: ActivatedRoute, useValue: route },
      ]
    });
    component = TestBed.runInInjectionContext(() => new LowerThirdComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active slide when new slides arrive', () => {
    component.setNewSlides([
      { text: 'Verse 1', selected: true, html: '', tag: '', chords: '', lines: [], first_slide_of_tag: false, img: '' } as any,
      { text: 'Verse 2', selected: false, html: '', tag: '', chords: '', lines: [], first_slide_of_tag: false, img: '' } as any
    ]);
    expect(component.activeSlide).toBe(0);
  });
});
