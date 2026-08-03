import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceListComponent } from './service-list.component';
import { OpenLPService } from '../../../services/openlp.service';

describe('ServiceListComponent', () => {
  let component: ServiceListComponent;
  let openlpService: OpenLPService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    openlpService = {
      getServiceItems: vi.fn().mockReturnValue(of([{ id: '1', title: 'Test item', notes: '', plugin: 'songs', selected: false, is_valid: true, slides: [] }] as any)),
      stateChanged$: of({}),
    } as unknown as OpenLPService;
    changeDetectorRef = { detectChanges: vi.fn() } as unknown as ChangeDetectorRef;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new ServiceListComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load service items during init', () => {
    component.ngOnInit();
    expect(openlpService.getServiceItems).toHaveBeenCalled();
    expect(component.items.length).toBe(1);
  });
});
