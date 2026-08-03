import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SlideItemComponent } from './slide-item.component';

describe('SlideItemComponent', () => {
  let component: SlideItemComponent;

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new SlideItemComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the selected slide', () => {
    const slide = { text: 'Verse 1' } as any;
    const spy = vi.fn();
    component.selectSlide.subscribe(spy);
    component.onSlideSelected(slide);
    expect(spy).toHaveBeenCalledWith(slide);
  });
});
