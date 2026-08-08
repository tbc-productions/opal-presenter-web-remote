import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChordProPipe } from './chordpro.pipe';

describe('ChordProPipe', () => {
  let pipe: ChordProPipe;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    pipe = TestBed.runInInjectionContext(() => new ChordProPipe());
  });

  it('should render chord and lyric markup for chord view styling', () => {
    vi.spyOn(pipe, 'decodeHTML').mockImplementation(value => value);
    const html = (pipe as any).parseToHTML('[=D]Amazing [D7]grace');

    expect(html).toBeTruthy();
    expect(html).toContain('<div class="with-chords">');
    expect(html).toContain('data-chord="=D"');
    expect(html).toContain('data-chord="D7"');
    expect(html).not.toContain('[attr.data-chord]');
    expect(html).toContain('<span class="chord">=D</span>');
    expect(html).toContain('<span class="chord">D7</span>');
    expect(html).toContain('<span class="text ');

    // The chord span must be emitted before the lyric text span so chord-view CSS can place it above the lyric line.
    expect(html).toMatch(/<span class="chord">=D<\/span><span class="text\s*">/);
  });

  it('should not insert a split-space under the opening key chord', () => {
    vi.spyOn(pipe, 'decodeHTML').mockImplementation(value => value);
    const html = (pipe as any).parseToHTML('[=D]Amazing [D7]grace');

    expect(html).toContain('data-chord="=D" class="overlap-chord"');
    expect(html).not.toContain('data-chord="=D" class=""');
    expect(html).not.toContain('</span></span> mazing');
  });
});
