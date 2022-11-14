import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { State } from './responses';
import { OpenLPService, WebSocketStatus } from './openlp.service';
import { WindowRef } from './window-ref.service';
import { PageTitleService } from './page-title.service';
import { LoginComponent } from './components/login/login.component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
// import { version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _fastSwitching = false;
  state = new State();
  showLogin = false;
  pageTitle = 'OpenLP Remote';
  appVersion = '0.0';
  webSocketOpen = false;

  constructor(private pageTitleService: PageTitleService, private openlpService: OpenLPService,
              private dialog: MatDialog, private windowRef: WindowRef) {
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
    this.openlpService.retrieveSystemInformation().subscribe(res => this.showLogin = res.login_required);
  }

  get fastSwitching(): boolean {
    if (localStorage.getItem('OpenLP-fastSwitching')) {
      this._fastSwitching = JSON.parse(localStorage.getItem('OpenLP-fastSwitching'));
    }
    return this._fastSwitching;
  }

  set fastSwitching(value: boolean) {
    this._fastSwitching = value;
    localStorage.setItem('OpenLP-fastSwitching', JSON.stringify(value));
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

  sliderChanged(event: MatSlideToggleChange) {
    this.fastSwitching = event.checked;
  }

  forceWebSocketReconnection() {
    this.openlpService.reconnectWebSocketIfNeeded();
  }
}
