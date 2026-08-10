import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { EventManager } from '@angular/platform-browser';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OpenLPService } from './openlp.service';
import { ShortcutsService } from './shortcuts.service';

describe('ShortcutsService', () => {
  let service: ShortcutsService;
  let documentMock: {
    activeElement: { tagName: string } | null;
    location: { pathname: string };
    querySelector: ReturnType<typeof vi.fn>;
  };
  let eventHandler: ((event: KeyboardEvent) => void) | undefined;

  beforeEach(() => {
    eventHandler = undefined;
    documentMock = {
      activeElement: { tagName: 'DIV' },
      location: { pathname: '/slides' },
      querySelector: vi.fn().mockReturnValue(null),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: documentMock,
        },
        {
          provide: EventManager,
          useValue: {
            addEventListener: vi.fn((_: unknown, __: string, handler: (event: KeyboardEvent) => void) => {
              eventHandler = handler;
              return () => {
                // no-op for test dispose
              };
            }),
          },
        },
        {
          provide: OpenLPService,
          useValue: {
            getShortcuts: vi.fn().mockReturnValue(of([])),
          },
        },
      ],
    });

    service = TestBed.runInInjectionContext(() => new ShortcutsService());
  });

  it('should trigger shortcut on slides route', () => {
    const nextSpy = vi.fn();
    service.addShortcut({ keys: 'Down' }).subscribe(nextSpy);

    const keyboardEvent = { preventDefault: vi.fn() } as unknown as KeyboardEvent;
    eventHandler?.(keyboardEvent);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(keyboardEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should trigger shortcut on service route when split view is active', () => {
    documentMock.location.pathname = '/service';
    documentMock.querySelector.mockReturnValue({});

    const nextSpy = vi.fn();
    service.addShortcut({ keys: 'Down' }).subscribe(nextSpy);

    const keyboardEvent = { preventDefault: vi.fn() } as unknown as KeyboardEvent;
    eventHandler?.(keyboardEvent);

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(keyboardEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should not trigger shortcut on service route when split view is inactive', () => {
    documentMock.location.pathname = '/service';
    documentMock.querySelector.mockReturnValue(null);

    const nextSpy = vi.fn();
    service.addShortcut({ keys: 'Down' }).subscribe(nextSpy);

    const keyboardEvent = { preventDefault: vi.fn() } as unknown as KeyboardEvent;
    eventHandler?.(keyboardEvent);

    expect(nextSpy).not.toHaveBeenCalled();
    expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
  });
});
