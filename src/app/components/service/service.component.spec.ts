import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceComponent } from './service.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { SettingsService } from '../../services/settings.service';
import { WindowRef } from '../../services/window-ref.service';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let router: Router;
  let openlpService: OpenLPService;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;
  let settingsService: SettingsService;
  let windowRef: WindowRef;

  beforeEach(() => {
    router = {
      navigate: vi.fn(),
    } as unknown as Router;
    openlpService = {
      setServiceItem: vi.fn().mockReturnValue(of({})),
    } as unknown as OpenLPService;
    pageTitleService = {
      changePageTitle: vi.fn(),
    } as unknown as PageTitleService;
    translateService = {
      stream: vi.fn().mockReturnValue(of('SERVICE')),
    } as unknown as TranslateService;
    settingsService = {
      get: vi.fn().mockReturnValue(false),
      set: vi.fn(),
      onPropertyChanged: vi.fn().mockReturnValue(of(false)),
    } as unknown as SettingsService;
    windowRef = {
      nativeWindow: {
        innerWidth: 1024,
      },
    } as unknown as WindowRef;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: OpenLPService, useValue: openlpService },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: SettingsService, useValue: settingsService },
        { provide: TranslateService, useValue: translateService },
        { provide: WindowRef, useValue: windowRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new ServiceComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to slides when selecting a valid item', () => {
    const item = { id: '1', is_valid: true } as any;
    component.onItemSelected(item);

    expect(openlpService.setServiceItem).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['slides']);
  });

  it('should enable side-by-side option when width is large enough', () => {
    (windowRef.nativeWindow as { innerWidth: number }).innerWidth = 1300;
    (settingsService.get as any).mockReturnValue(true);
    (settingsService.onPropertyChanged as any).mockReturnValue(of(true));

    component.ngOnInit();

    expect(component.canShowSideBySideSlides).toBe(true);
    expect(component.showSlidesInSidePanel).toBe(true);
  });

  it('should keep service view open when side panel is enabled', () => {
    (component as any).canShowSideBySideSlides = true;
    (component as any).showSlidesInSidePanel = true;

    const item = { id: '1', is_valid: true } as any;
    component.onItemSelected(item);

    expect(openlpService.setServiceItem).toHaveBeenCalledWith('1');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
