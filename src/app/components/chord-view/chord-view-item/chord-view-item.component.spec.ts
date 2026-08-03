import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChordViewItemComponent } from './chord-view-item.component';

describe('ChordViewItemComponent', () => {
  let component: ChordViewItemComponent;

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new ChordViewItemComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace line breaks in chordpro text', () => {
    const slide = { chords: 'A<br>B' } as any;
    expect(component.chordproFormatted(slide)).toBe('A\nB');
  });
});
