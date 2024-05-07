import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { TranslateService } from '@ngx-translate/core';

import { State, Display, DisplayMode } from './responses';
import { OpenLPService, WebSocketStatus } from './openlp.service';
import { WindowRef } from './window-ref.service';
import { PageTitleService } from './page-title.service';
import { LoginComponent } from './components/login/login.component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DisplayModeSelectorComponent } from './components/display-mode-selector/display-mode-selector.component';
import { Shortcuts, ShortcutsService } from './shortcuts.service';
import { ShortcutPipe } from './components/pipes/shortcut.pipe';
import { SettingsService } from './settings.service';
import * as supportedBrowsers from '../assets/supportedBrowsers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // Make DisplayMode enum visible to html code
  DisplayMode = DisplayMode;

  state = new State();
  showLogin = false;
  pageTitle = 'OpenLP Remote';
  appVersion = '0.0';
  webSocketOpen = false;
  fastSwitching = false;
  bigDisplayButtons = false;
  useShortcutsFromOpenlp = false;
  useLanguageFromOpenlp = false;

  constructor(private translateService: TranslateService, private pageTitleService: PageTitleService,
              private openlpService: OpenLPService, private dialog: MatDialog, private bottomSheet: MatBottomSheet,
              private windowRef: WindowRef, private shortcutsService: ShortcutsService, private settingsService: SettingsService) {
    this.pageTitleService.pageTitleChanged$.subscribe(pageTitle => this.pageTitle = pageTitle);
    this.openlpService.stateChanged$.subscribe(item => this.state = item);
    this.openlpService.webSocketStateChanged$.subscribe(status => this.webSocketOpen = status === WebSocketStatus.Open);
    this.shortcutsService.shortcutsChanged$.subscribe(shortcuts => this.addShortcuts(shortcuts));
    this.appVersion = this.windowRef.nativeWindow.appVersion || '0.0';

    this.webSocketOpen = openlpService.webSocketStatus === WebSocketStatus.Open;
    // Try to force websocket reconnection as user is now focused on window and will try to interact soon
    // Adding a debounce to avoid event flooding
    fromEvent(window, 'focus')
      .pipe(debounceTime(300))
      .subscribe(() => this.forceWebSocketReconnection());
  }

  ngOnInit(): void {
    if (!(supportedBrowsers.test(navigator.userAgent))) {
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
    this.settingsService.onPropertyChanged('fastSwitching').subscribe(value => this.fastSwitching = value);
    this.bigDisplayButtons = this.settingsService.get('bigDisplayButtons');
    this.settingsService.onPropertyChanged('bigDisplayButtons').subscribe(value => this.bigDisplayButtons = value);
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
    display.displayMode = this.state.displayMode;
    display.bigDisplayButtons = this.bigDisplayButtons;
    const selectorRef = this.bottomSheet.open(DisplayModeSelectorComponent, {data: display});
    selectorRef.afterDismissed().subscribe(result => {
      if (result === DisplayMode.Blank) {this.blankDisplay();}
      else if (result === DisplayMode.Desktop) {this.desktopDisplay();}
      else if (result === DisplayMode.Theme) {this.themeDisplay();}
      else if (result === DisplayMode.Presentation) {this.showDisplay();}
    });
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLogin = false;
        this.openlpService.setAuthToken(result.token);
      }
    });
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
