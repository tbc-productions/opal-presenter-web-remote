import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { StageViewItemComponent } from './stage-view-item.component';

describe('StageViewItemComponent', () => {
  let component: StageViewItemComponent;

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new StageViewItemComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
