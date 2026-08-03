import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MainViewComponent } from './main-view.component';
import { OpenLPService } from '../../services/openlp.service';

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('MainViewComponent', () => {
  let component: MainViewComponent;
  let openlpService: OpenLPService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(() => {
    changeDetectorRef = { markForCheck: vi.fn() } as unknown as ChangeDetectorRef;
    openlpService = {
      getMainImage: vi.fn().mockReturnValue(of({ binary_image: 'image-data' })) ,
      stateChanged$: of({}),
    } as unknown as OpenLPService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new MainViewComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cache the main image when updated', () => {
    component.updateImage();
    expect(component.overlayImage).toBe('image-data');
  });
});
