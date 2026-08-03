import { TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemesComponent } from './themes.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';

describe('ThemesComponent', () => {
  let component: ThemesComponent;
  let openlpService: OpenLPService;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;

  beforeEach(() => {
    openlpService = {
      getThemeLevel: vi.fn().mockReturnValue(of('verse')),
      getThemes: vi.fn().mockReturnValue(of([{ name: 'Default', selected: false, thumbnail: {} }] as any)),
      getTheme: vi.fn().mockReturnValue(of('Default')),
      setThemeLevel: vi.fn().mockReturnValue(of({})),
      setTheme: vi.fn().mockReturnValue(of({})),
    } as unknown as OpenLPService;
    pageTitleService = {
      changePageTitle: vi.fn(),
    } as unknown as PageTitleService;
    translateService = {
      stream: vi.fn().mockReturnValue(of('THEMES')),
    } as unknown as TranslateService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new ThemesComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report that song-level theme handling is unsupported', () => {
    component['_themeLevel'] = 'song';
    expect(component.isThemeLevelSupported()).toBe(false);
  });
});
