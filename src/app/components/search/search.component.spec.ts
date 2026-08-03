import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchComponent } from './search.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let openlpService: OpenLPService;
  let pageTitleService: PageTitleService;
  let translateService: TranslateService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    openlpService = {
      search: vi.fn().mockReturnValue(of([])),
      searchAll: vi.fn().mockReturnValue(of([])),
      sendItemLive: vi.fn(),
      addItemToService: vi.fn(),
      getSearchablePlugins: vi.fn().mockReturnValue(of([])),
    } as unknown as OpenLPService;
    pageTitleService = {
      changePageTitle: vi.fn(),
    } as unknown as PageTitleService;
    translateService = {
      stream: vi.fn().mockReturnValue(of('SEARCH')),
      instant: vi.fn().mockReturnValue('Song'),
    } as unknown as TranslateService;
    changeDetectorRef = {
      detectChanges: vi.fn(),
    } as unknown as ChangeDetectorRef;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: TranslateService, useValue: translateService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new SearchComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the search button when there is no text', () => {
    component.searchText = '  ';
    component.onSearchTextChange();
    expect(component.isSearchButttonDisabled).toBe(true);
  });

  it('should search for the current plugin', () => {
    component.selectedPlugin = 'songs';
    component.searchText = 'Amazing Grace';
    component.onSearch();
    expect(openlpService.search).toHaveBeenCalledWith('songs', 'Amazing Grace');
  });
});
