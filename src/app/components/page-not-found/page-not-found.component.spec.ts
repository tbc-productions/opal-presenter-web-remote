import { PageNotFoundComponent } from './page-not-found.component';

import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new PageNotFoundComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

