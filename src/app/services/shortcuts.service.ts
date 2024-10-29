import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { OpenLPService } from './openlp.service';

export class Shortcuts {
  previousSlide = ['Up', 'PgUp'];
  nextSlide = ['Down', 'PgDown'];
  previousItem = ['Left'];
  nextItem = ['Right'];
  showDisplay = ['Space'];
  themeDisplay = ['t'];
  blankDisplay = ['.'];
  desktopDisplay = ['d'];
}

interface Options {
  element: any;
  keys: string;
}

@Injectable()
export class ShortcutsService {
  defaults: Partial<Options> = {
    element: this.document
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private eventManager: EventManager,
    private openlpService: OpenLPService) {
      this.shortcutsChanged$ = new EventEmitter<Shortcuts>();
    }

  private shortcuts: Shortcuts
  public shortcutsChanged$: EventEmitter<Shortcuts>;

  getShortcuts(useShortcutsFromOpenlp: boolean) {
    const shortcuts: Shortcuts = new Shortcuts()
    if (useShortcutsFromOpenlp) {
      this.openlpService.getShortcuts().subscribe(res => {
        res.forEach((shortcut) => {
          switch (shortcut.action) {
            case 'blankScreen':
              shortcuts.blankDisplay = shortcut.shortcut;
              break;
            case 'desktopScreen':
              shortcuts.desktopDisplay = shortcut.shortcut;
              break;
            case 'nextItem_live':
              shortcuts.nextSlide = shortcut.shortcut;
              break;
            case 'nextService':
              shortcuts.nextItem = shortcut.shortcut;
              break;
            case 'previousItem_live':
              shortcuts.previousSlide = shortcut.shortcut;
              break;
            case 'previousService':
              shortcuts.previousItem = shortcut.shortcut;
              break;
            case 'showScreen':
              shortcuts.showDisplay = shortcut.shortcut;
              break;
            case 'themeScreen':
              shortcuts.themeDisplay = shortcut.shortcut;
              break;
          }
        })
        this._handleShortcutsChanged(shortcuts);
      })
    } else {
      this._handleShortcutsChanged(shortcuts);
    }
  }

 
  addShortcut(options: Partial<Options>) {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        const activeElement = this.document.activeElement;
        const notOnInput = activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA';
        if (notOnInput) {
          if (document.URL.endsWith('/slides')) {
            e.preventDefault();
            observer.next(e);
          }
        }
      };

      const dispose = this.eventManager.addEventListener(
        merged.element, event, handler
      );

      return () => {
        dispose();
      };
    });
  }

  protected _handleShortcutsChanged(shortcuts: Shortcuts) {
    this.shortcuts = shortcuts;
    this.shortcutsChanged$.emit(this.shortcuts);
  }
}
