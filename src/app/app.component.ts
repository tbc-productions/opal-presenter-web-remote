import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { TranslateService } from '@ngx-translate/core';

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
import * as supportedBrowsers from '../assets/supportedBrowsers';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit {
  // Make DisplayMode enum visible to HTML code.
  DisplayMode = DisplayMode;

  state = new State();
  showLogin: boolean;
  pageTitle = 'OpenLP Remote';
  appVersion = '0.0';
  webSocketOpen = false;
  fastSwitching = false;
  bigDisplayButtons = false;
  darkTheme = false;
  useShortcutsFromOpenlp = false;
  useLanguageFromOpenlp = false;

  constructor(private translateService: TranslateService, private pageTitleService: PageTitleService,
              private openlpService: OpenLPService, private bottomSheet: MatBottomSheet,
              private windowRef: WindowRef, private shortcutsService: ShortcutsService, private settingsService: SettingsService) {
    this.pageTitleService.pageTitleChanged$.subscribe(pageTitle => this.pageTitle = pageTitle);
    this.openlpService.stateChanged$.subscribe(item => this.state = item);
    this.openlpService.webSocketStateChanged$.subscribe(status => this.webSocketOpen = status === WebSocketStatus.Open);
    this.shortcutsService.shortcutsChanged$.subscribe(shortcuts => this.addShortcuts(shortcuts));
    this.openlpService.isLoggedInChanged$.subscribe(result => this.showLogin = !result);
    this.appVersion = this.windowRef.nativeWindow.appVersion || '0.0';

    this.webSocketOpen = openlpService.webSocketStatus === WebSocketStatus.Open;
    // Try to force websocket reconnection as user is now focused on window and will try to interact soon
    // Adding a debounce to avoid event flooding
    fromEvent(window, 'focus')
      .pipe(debounceTime(300))
      .subscribe(() => this.forceWebSocketReconnection());
  }

  ngOnInit(): void {
    if (!(supportedBrowsers.default.test(navigator.userAgent))) {
      window.location.replace("/assets/notsupported.html");
    }
    this.openlpService.retrieveSystemInformation().subscribe(res => {
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
    this.fastSwitching = this.settingsService.get('fastSwitching');
    this.settingsService.onPropertyChanged('fastSwitching').subscribe((value: boolean) => this.fastSwitching = value);
    this.bigDisplayButtons = this.settingsService.get('bigDisplayButtons');
    this.darkTheme = this.settingsService.get('darkTheme');
    this.settingsService.onPropertyChanged('bigDisplayButtons').subscribe((value: boolean) => this.bigDisplayButtons = value);
    this.settingsService.onPropertyChanged('darkTheme').subscribe((value: boolean) => this.darkTheme = value);
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

  login() {
    this.openlpService.openLoginDialog();
  }

  nextItem() {
    this.openlpService.nextItem().subscribe();
  }

  previousItem() {
    this.openlpService.previousItem().subscribe();
  }

  nextSlide() {
    this.openlpService.nextSlide().subscribe();
  }

  previousSlide() {
    this.openlpService.previousSlide().subscribe();
  }

  blankDisplay() {
    this.openlpService.blankDisplay().subscribe();
  }

  themeDisplay() {
    this.openlpService.themeDisplay().subscribe();
  }

  desktopDisplay() {
    this.openlpService.desktopDisplay().subscribe();
  }

  showDisplay() {
    this.openlpService.showDisplay().subscribe();
  }

  forceWebSocketReconnection() {
    this.openlpService.reconnectWebSocketIfNeeded();
  }
}
