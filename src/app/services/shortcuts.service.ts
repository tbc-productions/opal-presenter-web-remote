
import { DOCUMENT, EventEmitter, inject, OnDestroy, Service } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { OpenLPService } from './openlp.service';
import { Shortcuts } from '../models/shortcuts';

interface Options {
  element: any;
  keys: string;
}

@Service()
export class ShortcutsService implements OnDestroy {
  private document: Document = inject<Document>(DOCUMENT);
  private eventManager: EventManager = inject(EventManager);
  private openlpService: OpenLPService = inject(OpenLPService);
  private subscriptions: Subscription[] = [];

  defaults: Partial<Options> = {
    element: this.document
  };

  private shortcuts: Shortcuts = new Shortcuts();
  public shortcutsChanged$: EventEmitter<Shortcuts>;

  constructor() {
    this.shortcutsChanged$ = new EventEmitter<Shortcuts>();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getShortcuts(useShortcutsFromOpenlp: boolean): void {
    const shortcuts: Shortcuts = new Shortcuts()
    if (useShortcutsFromOpenlp) {
      const getShortcutsSubscription = this.openlpService.getShortcuts().subscribe(res => {
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
      this.subscriptions.push(getShortcutsSubscription);
    } else {
      this._handleShortcutsChanged(shortcuts);
    }
  }

  addShortcut(options: Partial<Options>): Observable<KeyboardEvent> {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        const activeElement = this.document.activeElement;
        const notOnInput = activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA';
        if (notOnInput) {
          if (this.isShortcutContextAllowed()) {
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

  private isShortcutContextAllowed(): boolean {
    const pathname = this.document.location.pathname;
    const isSlidesRoute = pathname.endsWith('/slides');
    if (isSlidesRoute) {
      return true;
    }
    const isServiceRoute = pathname.endsWith('/service');
    const isServiceSplitView = !!this.document.querySelector('openlp-service .service-content.split-view');
    return isServiceRoute && isServiceSplitView;
  }

  protected _handleShortcutsChanged(shortcuts: Shortcuts): void {
    this.shortcuts = shortcuts;
    this.shortcutsChanged$.emit(this.shortcuts);
  }
}
