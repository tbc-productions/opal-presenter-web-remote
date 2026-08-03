import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SlidesComponent } from './slides.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';

describe('SlidesComponent', () => {
  let component: SlidesComponent;
  let openlpService: OpenLPService;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;

  beforeEach(() => {
    openlpService = {
      setSlide: vi.fn().mockReturnValue(of({})),
    } as unknown as OpenLPService;
    pageTitleService = {
      changePageTitle: vi.fn(),
    } as unknown as PageTitleService;
    translateService = {
      stream: vi.fn().mockReturnValue(of('SLIDES')),
    } as unknown as TranslateService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new SlidesComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a slide through the openlp service', () => {
    const item = { index: 2 } as any;
    component.onSlideSelected(item);
    expect(openlpService.setSlide).toHaveBeenCalledWith(2);
  });
});
