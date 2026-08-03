import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsComponent } from './settings.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { SettingsService } from '../../services/settings.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;
  let settingsService: SettingsService;

  beforeEach(() => {
    pageTitleService = {
      changePageTitle: vi.fn(),
    } as unknown as PageTitleService;
    translateService = {
      stream: vi.fn().mockReturnValue(of('SETTINGS')),
    } as unknown as TranslateService;
    settingsService = {
      getAll: vi.fn().mockReturnValue({}),
      set: vi.fn(),
      settingChanged$: of({ property: 'stageFontScale', value: 100 }),
    } as unknown as SettingsService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: OpenLPService, useValue: { showAlert: vi.fn() } },
        { provide: SettingsService, useValue: settingsService },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new SettingsComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scale fonts for the stage and chords presets', () => {
    expect(component.getFontScale('stage')).toBe(100);
    expect(component.getFontScale('chords')).toBe(100);
  });

  it('should delegate settings changes to the settings service', () => {
    component.setFontScale('stage', 125);
    expect(settingsService.set).toHaveBeenCalledWith('stageFontScale', 125);
  });
});
