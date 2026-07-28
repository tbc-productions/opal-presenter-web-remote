import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import NoSleep from 'nosleep.js';

import { State } from './models/state';
import { Display } from './models/display';
import { DisplayMode } from './enums/display-mode.enum';
import { OpenLPService } from './services/openlp.service';
import { WebSocketStatus } from './enums/web-socket-status.enum';
import { WindowRef } from './services/window-ref.service';
import { PageTitleService } from './services/page-title.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DisplayModeSelectorComponent } from './components/display-mode-selector/display-mode-selector.component';
import { Shortcuts } from './models/shortcuts';
import { ShortcutsService } from './services/shortcuts.service';
import { ShortcutPipe } from './pipes/shortcut.pipe';
import { SettingsService } from './services/settings.service';

import supportedBrowsers from '../assets/supportedBrowsers';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  private bottomSheet: MatBottomSheet = inject(MatBottomSheet); 
  private openlpService: OpenLPService = inject(OpenLPService);
  private pageTitleService: PageTitleService = inject(PageTitleService);
  private settingsService: SettingsService = inject(SettingsService);  
  private shortcutsService: ShortcutsService = inject(ShortcutsService);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);
  private windowRef: WindowRef = inject(WindowRef);
  
  // Make DisplayMode enum visible to HTML code.
  displayMode: typeof DisplayMode = DisplayMode;
  
  noSleep: NoSleep = new NoSleep();
  state: State = new State();
  showLogin: boolean = false;
  pageTitle: string = 'OpenLP Remote';
  appVersion: string = '0.0';
  webSocketOpen: boolean = false;
  fastSwitching: boolean = false;
  bigDisplayButtons: boolean = false;
  darkTheme: boolean = false;
  useShortcutsFromOpenlp: boolean = false;
  useLanguageFromOpenlp: boolean = false;

  ngOnInit(): void {
    this.appVersion = this.windowRef.nativeWindow.appVersion || '0.0';
    this.webSocketOpen = this.openlpService.webSocketStatus === WebSocketStatus.Open;
    if (!(supportedBrowsers.test(navigator.userAgent))) {
      window.location.replace("/assets/notsupported.html");
    }
    // Try to force websocket reconnection as user is now focused on window and will try to interact soon
    // Adding a debounce to avoid event flooding
    const webSocketReconnectionSubscription = fromEvent(window, 'focus')
      .pipe(debounceTime(300))
      .subscribe(() => this.forceWebSocketReconnection());
    const retrieveSystemInformationSubscription =this.openlpService.retrieveSystemInformation().subscribe(res => {
        this.showLogin = res.login_required
        this.useLanguageFromOpenlp = this.openlpService.assertApiVersionMinimum(2, 5)
        if (this.useLanguageFromOpenlp) {
          this.openlpService.getLanguage().subscribe(res => {
            this.translateService.use(res.language);
          });
        } else {
          this.translateService.use('default');
        }
        this.useShortcutsFromOpenlp = this.openlpService.assertApiVersionMinimum(2, 5)
        this.shortcutsService.getShortcuts(this.useShortcutsFromOpenlp);
      }
    );
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      (state: State) => this.state = state
    );
    const webSocketStateChangedSubscription = this.openlpService.webSocketStateChanged$.subscribe(
      (status: WebSocketStatus) => this.webSocketOpen = status === WebSocketStatus.Open
    );
    this.fastSwitching = this.settingsService.get('fastSwitching') || false;
    const fastSwitchingOnPropertyChangedSubscription = this.settingsService.onPropertyChanged('fastSwitching').subscribe(
      (value: boolean) => this.fastSwitching = value
    );
    this.bigDisplayButtons = this.settingsService.get('bigDisplayButtons') || false;
    this.darkTheme = this.settingsService.get('darkTheme') || false;
    const bigDisplayButtonsOnPropertyChangedSubscription = this.settingsService.onPropertyChanged('bigDisplayButtons').subscribe(
      (value: boolean) => this.bigDisplayButtons = value
    );
    this.settingsService.set('wakeLock', false);
    const wakeLockOnPropertyChangedSubscription = this.settingsService.onPropertyChanged('wakeLock').subscribe(
      (value: boolean) => {
        if (value) {
          this.noSleep.enable()
        } else {
          this.noSleep.disable()
        }
      }
    );
    const darkThemeOnPropertyChangedSubscription = this.settingsService.onPropertyChanged('darkTheme').subscribe(
      (value: boolean) => this.darkTheme = value);
    const shortcutsChangedSubscription = this.shortcutsService.shortcutsChanged$.subscribe(
      (shortcuts: Shortcuts) => this.addShortcuts(shortcuts)
    );
    const isLoggedInChangedSubscription = this.openlpService.isLoggedInChanged$.subscribe(
      (result: boolean) => this.showLogin = !result
    );
    this.subscriptions.push(
      webSocketReconnectionSubscription,
      retrieveSystemInformationSubscription,
      stateChangedSubscription,
      webSocketStateChangedSubscription,
      fastSwitchingOnPropertyChangedSubscription,
      bigDisplayButtonsOnPropertyChangedSubscription,
      wakeLockOnPropertyChangedSubscription,
      darkThemeOnPropertyChangedSubscription,
      shortcutsChangedSubscription,
      isLoggedInChangedSubscription
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addShortcuts(shortcuts: Shortcuts): void {
    const shortcutPipe = new ShortcutPipe();
    shortcuts.previousSlide.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.previousSlide()
      )
    });
    shortcuts.nextSlide.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.nextSlide()
      )
    });
    shortcuts.previousItem.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.previousItem()
      )
    });
    shortcuts.nextItem.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.nextItem()
      )
    });
    shortcuts.showDisplay.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() => {
        if (this.state.displayMode !== DisplayMode.Presentation) {
          this.showDisplay();
        }
      })
    });
    shortcuts.themeDisplay.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.state.displayMode === DisplayMode.Theme ? this.showDisplay() : this.themeDisplay()
      )
    });
    shortcuts.blankDisplay.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.state.displayMode === DisplayMode.Blank ? this.showDisplay() : this.blankDisplay()
      )
    });
    shortcuts.desktopDisplay.forEach((key) => {
      this.shortcutsService.addShortcut({ keys: shortcutPipe.transform(key) }).subscribe(() =>
        this.state.displayMode === DisplayMode.Desktop ? this.showDisplay() : this.desktopDisplay()
      )
    });
  }

  openDisplayModeSelector(): void {
    const display = new Display();
    display.bigDisplayButtons = this.bigDisplayButtons;
    display.darkTheme = this.darkTheme;
    display.displayMode = this.state.displayMode;
    const selectorRef = this.bottomSheet.open(
      DisplayModeSelectorComponent,
      {
        data: display
      }
    );
    selectorRef.afterDismissed().subscribe((result: DisplayMode) => {
      if (result === DisplayMode.Blank) {this.blankDisplay();}
      else if (result === DisplayMode.Desktop) {this.desktopDisplay();}
      else if (result === DisplayMode.Theme) {this.themeDisplay();}
      else if (result === DisplayMode.Presentation) {this.showDisplay();}
    });
  }

  login(): void {
    this.openlpService.openLoginDialog();
  }

  nextItem(): void {
    this.openlpService.nextItem().subscribe();
  }

  previousItem(): void {
    this.openlpService.previousItem().subscribe();
  }

  nextSlide(): void {
    this.openlpService.nextSlide().subscribe();
  }

  previousSlide(): void {
    this.openlpService.previousSlide().subscribe();
  }

  blankDisplay(): void {
    this.openlpService.blankDisplay().subscribe();
  }

  themeDisplay(): void {
    this.openlpService.themeDisplay().subscribe();
  }

  desktopDisplay(): void {
    this.openlpService.desktopDisplay().subscribe();
  }

  showDisplay(): void {
    this.openlpService.showDisplay().subscribe();
  }

  forceWebSocketReconnection(): void {
    this.openlpService.reconnectWebSocketIfNeeded();
  }
}
