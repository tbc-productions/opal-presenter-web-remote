import { TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchOptionsComponent } from './search-options.component';
import { OpenLPService } from '../../../services/openlp.service';

describe('SearchOptionsComponent', () => {
  let component: SearchOptionsComponent;
  let openlpService: OpenLPService;
  let translateService: TranslateService;

  beforeEach(() => {
    openlpService = {
      getSearchOptions: vi.fn().mockReturnValue(of([{ name: 'primary bible', list: ['KJV'], selected: 'KJV' }])),
      setSearchOption: vi.fn(),
    } as unknown as OpenLPService;
    translateService = { stream: vi.fn().mockReturnValue(of('BIBLE_VERSION')) } as unknown as TranslateService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: TitleCasePipe, useValue: { transform: (value: string) => value } },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new SearchOptionsComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bible search options for the selected plugin', () => {
    component.onPluginChange('bibles');
    expect(openlpService.getSearchOptions).toHaveBeenCalledWith('bibles');
    expect(component.searchOptions).toEqual(['KJV']);
  });
});
