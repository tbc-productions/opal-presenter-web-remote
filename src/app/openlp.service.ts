import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

import {
  PluginDescription,
  State,
  Slide,
  ServiceItem,
  Theme,
  MainView,
  Shortcut,
  SystemInformation,
  Credentials,
  AuthToken,
  Message,
  MessageType
} from './responses';
import { environment } from '../environments/environment';
import { createWebSocket } from './openlp-websocket';
import { deserialize } from './utils';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

const WEBSOCKET_RECONNECT_TIMEOUT = 5 * 1000;

export enum WebSocketStatus {
  Open, Closed
}

@Injectable()
export class OpenLPService {
  private apiURL: string;
  public apiVersion: number | null;
  public apiRevision: number | null;
  private host: string;
  public stateChanged$: EventEmitter<State>;
  public messageReceived$: EventEmitter<Message<MessageType>>;
  public webSocketStateChanged$: EventEmitter<WebSocketStatus>;
  private isTwelveHourTime = true;

  private webSocketTimeoutHandle: any = 0;
  private _stateWebSocketSubscription: Subscription;
  private _messageWebSocketSubscription: Subscription;
  private _retrieveSystemInformationSubscription: Subscription;

  constructor(private http: HttpClient) {
    const host = window.location.hostname;
    let port: string;
    if (environment.production) {
      port = window.location.port;
    }
    else {
      port = '4316';
    }
    this.apiURL = `http://${host}:${port}/api/v2`;
    this.host = host;
    this.stateChanged$ = new EventEmitter<State>();
    this.webSocketStateChanged$ = new EventEmitter<WebSocketStatus>();
    this.messageReceived$ = new EventEmitter<Message<MessageType>>();
    this.createWebSocket();
  }

  assertApiVersionExact(version: number, revision: number) {
    return version === this.apiVersion && revision === this.apiRevision;
  }

  assertApiVersionMinimum(version: number, revision: number) {
    return this.apiVersion >= version && this.apiRevision >= revision;
  }

  setAuthToken(token: string): void {
    httpOptions.headers = httpOptions.headers.set('Authorization', token);
  }

  getIsTwelveHourTime(): boolean {
    return this.isTwelveHourTime;
  }

  retrieveSystemInformation(): Observable<SystemInformation> {
    return this.doGet<SystemInformation>(`${this.apiURL}/core/system`)
      .pipe(tap(systemInfo => {
        if (systemInfo.api_version) {
          this.apiVersion = systemInfo.api_version;
          this.apiRevision = systemInfo.api_revision;
        }
      }));
  }

  getMainImage(): Observable<MainView> {
    return this.doGet<MainView>(`${this.apiURL}/core/live-image`);
  }

  getShortcuts(): Observable<Shortcut[]> {
    return this.doGet(`${this.apiURL}/core/shortcuts`);
  }

  getSearchablePlugins(): Observable<PluginDescription[]> {
    return this.doGet<PluginDescription[]>(`${this.apiURL}/core/plugins`);
  }

  search(plugin, text): Observable<any> {
    return this.doGet(`${this.apiURL}/plugins/${plugin}/search?text=${text}`);
  }

  getSearchOptions(plugin): Observable<any> {
    return this.doGet(`${this.apiURL}/plugins/${plugin}/search-options`);
  }

  setSearchOption(plugin, option, value): Observable<any> {
    return this.doPost(`${this.apiURL}/plugins/${plugin}/search-options`, {option, value});
  }

  getServiceItems(): Observable<ServiceItem[]> {
    return this.doGet<ServiceItem[]>(`${this.apiURL}/service/items`);
  }

  setServiceItem(id: any): Observable<any> {
    return this.doPost(`${this.apiURL}/service/show`, {id});
  }

  nextItem(): Observable<any> {
    return this.doPost(`${this.apiURL}/service/progress`, {action: 'next'});
  }

  previousItem(): Observable<any> {
    return this.doPost(`${this.apiURL}/service/progress`, {action: 'previous'});
  }

  getServiceItem(): Observable<any> {
    return this.doGet<Slide[]>(`${this.apiURL}/controller/live-items`);
  }

  getNotes(): Observable<any> {
    return this.doGet(`${this.apiURL}/controller/notes`);
  }

  setSlide(id: any): Observable<any> {
    return this.doPost(`${this.apiURL}/controller/show`, {id});
  }

  nextSlide(): Observable<any> {
    return this.doPost(`${this.apiURL}/controller/progress`, {action: 'next'});
  }

  previousSlide(): Observable<any> {
    return this.doPost(`${this.apiURL}/controller/progress`, {action: 'previous'});
  }

  getThemeLevel(): Observable<any> {
    return this.doGet(`${this.apiURL}/controller/theme-level`);
  }

  getThemes(): Observable<Theme[]> {
    return this.doGet<Theme[]>(`${this.apiURL}/controller/themes`);
  }

  setThemeLevel(level): Observable<any> {
    return this.doPost(`${this.apiURL}/controller/theme-level`, {level});
  }

  getTheme(): Observable<any> {
    return this.doGet(`${this.apiURL}/controller/theme`);
  }

  setTheme(theme: string): Observable<any> {
    return this.doPost(`${this.apiURL}/controller/theme`, {theme});
  }

  blankDisplay(): Observable<any> {
    return this.doPost(`${this.apiURL}/core/display`, {display: 'blank'});
  }

  themeDisplay(): Observable<any> {
    return this.doPost(`${this.apiURL}/core/display`, {display: 'theme'});
  }

  desktopDisplay(): Observable<any> {
    return this.doPost(`${this.apiURL}/core/display`, {display: 'desktop'});
  }

  showDisplay(): Observable<any> {
    return this.doPost(`${this.apiURL}/core/display`, {display: 'show'});
  }

  showAlert(text): Observable<any> {
    return this.doPost(`${this.apiURL}/plugins/alerts`, {text});
  }

  sendItemLive(plugin, id): Observable<any> {
    return this.doPost(`${this.apiURL}/plugins/${plugin}/live`, {id});
  }

  addItemToService(plugin, id): Observable<any> {
    return this.doPost(`${this.apiURL}/plugins/${plugin}/add`, {id});
  }

  transposeSong(transpose_value, return_format = 'default'): Observable<any> {
    return this.doGet(`${this.apiURL}/plugins/songs/transpose-live-item/${transpose_value}?response_format=${return_format}`);
  }

  login(credentials: Credentials): Observable<AuthToken> {
    return this.doPost<AuthToken>(`${this.apiURL}/core/login`, credentials);
  }

  protected doGet<T>(url: string): Observable<T> {
    return this.http.get<T>(url, httpOptions);
  }

  protected doPost<T>(url: string, body: any): Observable<T> {
    // User is expecting instant response, so we'll accelerate the websocket reconnection process if needed.
    this.reconnectWebSocketIfNeeded();
    return this.http.post<T>(url, body, httpOptions);
  }

  get webSocketStatus(): WebSocketStatus {
    if (!this._stateWebSocketSubscription || this._stateWebSocketSubscription.closed) {
      return WebSocketStatus.Closed;
    }
    return WebSocketStatus.Open;
  }

  reconnectWebSocketIfNeeded() {
    if (this.webSocketStatus === WebSocketStatus.Closed) {
      this.createWebSocket();
    }
  }

  createWebSocket() {
    this.clearWebSocketTimeoutHandle();
    if (this._retrieveSystemInformationSubscription) {
      // Cancels ongoing request to avoid connection flooding
      this._retrieveSystemInformationSubscription.unsubscribe();
    }
    this._retrieveSystemInformationSubscription = this.retrieveSystemInformation()
      .pipe(
        shareReplay(1),
        finalize(() => this._retrieveSystemInformationSubscription = null)
      )
      .subscribe({
        next: info => {
          this.createStateWebsocketConnection(info.websocket_port);

          if (this.assertApiVersionMinimum(2, 4)) {
            this.createMessageWebsocketConnection(info.websocket_port);
          }
        },
        error: () => this.reconnectWebSocket()
      });
  }

  private createStateWebsocketConnection(websocketPort: number) {
    if (this._stateWebSocketSubscription) {
      this._stateWebSocketSubscription.unsubscribe();
    }

    let firstMessage = true;

    this._stateWebSocketSubscription = createWebSocket(
      this.host,
      websocketPort,
      (input: any) => deserialize(input.results, State)
    ).subscribe({
      next: (state) => {
        if (firstMessage) {
          this.webSocketStateChanged$.emit(WebSocketStatus.Open);
          firstMessage = false;
        }
        this.handleStateChange(state);
      },
      error: () => {
        this.webSocketStateChanged$.emit(WebSocketStatus.Closed);
        this.reconnectWebSocket();
      },
      complete: () => {
        this.webSocketStateChanged$.emit(WebSocketStatus.Closed);
        this.reconnectWebSocket();
      }
    });
  }

  private createMessageWebsocketConnection(websocketPort: number) {
    if (this._messageWebSocketSubscription) {
      this._messageWebSocketSubscription.unsubscribe();
    }

    this._stateWebSocketSubscription = createWebSocket(
      this.host,
      websocketPort,
      (input: any) => deserialize(input, Message),
      'messages',
    ).subscribe({
      next: (message) => this.handleMessage(message),
      error: () => this.reconnectWebSocket(),
      complete: () => this.reconnectWebSocket()
    });
  }

  private reconnectWebSocket = () => {
    this.clearWebSocketTimeoutHandle();
    this.webSocketTimeoutHandle = setTimeout(() => {
      this.createWebSocket();
    }, WEBSOCKET_RECONNECT_TIMEOUT);
  };

  private clearWebSocketTimeoutHandle() {
    if (this.webSocketTimeoutHandle) {
      clearTimeout(this.webSocketTimeoutHandle);
    }
  }

  handleStateChange(state: State) {
    this.isTwelveHourTime = state.twelve;
    this.stateChanged$.emit(state);
  }

  handleMessage(message: Message<MessageType>) {
    this.messageReceived$.emit(message);
  }
}
