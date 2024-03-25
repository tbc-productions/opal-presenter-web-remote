import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { State, DisplayMode } from './responses';
import { OpenLPService, WebSocketStatus } from './openlp.service';
import { WindowRef } from './window-ref.service';
import { PageTitleService } from './page-title.service';
import { LoginComponent } from './components/login/login.component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DisplayModeSelectorComponent } from './components/display-mode-selector/display-mode-selector.component';
import { HotKeysService } from './hotkeys.service';
import { SettingsService } from './settings.service';
import * as supportedBrowsers from '../assets/supportedBrowsers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  constructor(private pageTitleService: PageTitleService, private openlpService: OpenLPService,
              private dialog: MatDialog, private bottomSheet: MatBottomSheet, private windowRef: WindowRef,
              private hotKeysService: HotKeysService, private settingsService: SettingsService) {
    pageTitleService.pageTitleChanged$.subscribe(pageTitle => this.pageTitle = pageTitle);
    openlpService.stateChanged$.subscribe(item => this.state = item);
    openlpService.webSocketStateChanged$.subscribe(status => this.webSocketOpen = status === WebSocketStatus.Open);
    this.appVersion = windowRef.nativeWindow.appVersion || '0.0';
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
    this.openlpService.retrieveSystemInformation().subscribe(res => this.showLogin = res.login_required);
    this.addHotKeys();
    this.fastSwitching = this.settingsService.get('fastSwitching');
    this.settingsService.onPropertyChanged('fastSwitching').subscribe(value => this.fastSwitching = value);
  }

  addHotKeys(): void {
    this.hotKeysService.addShortcut({ keys: 'ArrowUp' }).subscribe(() =>
      this.previousSlide()
    );
    this.hotKeysService.addShortcut({ keys: 'ArrowDown' }).subscribe(() =>
      this.nextSlide()
    );
    this.hotKeysService.addShortcut({ keys: 'PageUp' }).subscribe(() =>
      this.previousSlide()
    );
    this.hotKeysService.addShortcut({ keys: 'PageDown' }).subscribe(() =>
      this.nextSlide()
    );
    this.hotKeysService.addShortcut({ keys: 'ArrowLeft' }).subscribe(() =>
      this.previousItem()
    );
    this.hotKeysService.addShortcut({ keys: 'ArrowRight' }).subscribe(() =>
      this.nextItem()
    );
    this.hotKeysService.addShortcut({ keys: 'Space' }).subscribe(() =>
      {
        if (this.state.displayMode !== DisplayMode.Presentation) {
          this.showDisplay();
        }
      }
    );
    this.hotKeysService.addShortcut({ keys: 't' }).subscribe(() =>
      this.state.displayMode === DisplayMode.Theme ? this.showDisplay() : this.themeDisplay()
    );
    this.hotKeysService.addShortcut({ keys: 'code.Period' }).subscribe(() =>
      this.state.displayMode === DisplayMode.Blank ? this.showDisplay() : this.blankDisplay()
    );
    this.hotKeysService.addShortcut({ keys: 'd' }).subscribe(() =>
      this.state.displayMode === DisplayMode.Desktop ? this.showDisplay() : this.desktopDisplay()
    );
  }

  openDisplayModeSelector(): void {
    const selectorRef = this.bottomSheet.open(DisplayModeSelectorComponent, {data: this.state.displayMode});
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
