import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceComponent } from './service.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let router: Router;
  let openlpService: OpenLPService;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;

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

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: OpenLPService, useValue: openlpService },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: TranslateService, useValue: translateService },
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
});
