import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SlideListComponent } from './slide-list.component';
import { OpenLPService } from '../../../services/openlp.service';

describe('SlideListComponent', () => {
  let component: SlideListComponent;
  let openlpService: OpenLPService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    openlpService = {
      getServiceItem: vi.fn().mockReturnValue(of([{ text: 'Verse 1', html: '', tag: '', chords: '', lines: [], first_slide_of_tag: false, img: '' }] as any)),
      stateChanged$: of({}),
    } as unknown as OpenLPService;
    changeDetectorRef = {
      detectChanges: vi.fn(),
    } as unknown as ChangeDetectorRef;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new SlideListComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch slides on init', () => {
    component.ngOnInit();
    expect(openlpService.getServiceItem).toHaveBeenCalled();
    expect(component.slides.length).toBe(1);
  });
});
