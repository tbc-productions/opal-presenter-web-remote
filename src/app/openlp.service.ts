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
  SystemInformation,
  Credentials,
  AuthToken
} from './responses';
import { environment } from '../environments/environment';


const deserialize = (json, cls) => {
  const inst = new cls();
  for (const p in json) {
    if (!json.hasOwnProperty(p)) {
      continue;
    }
    inst[p] = json[p];
  }
  return inst;
};

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
  public webSocketStateChanged$: EventEmitter<WebSocketStatus>;
  private isTwelveHourTime = true;

  private webSocketTimeoutHandle: any = 0;
  private ws: WebSocket = null;
  private retrieveSystemInformationSubscription: Subscription;

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
    this.createWebSocket();
  }

  assertApiVersionExact(version: number, revision: number) {
    return version === this.apiVersion && revision === this.apiRevision;
  }

  assertApiVersionMinimum(version: number, revision: number) {
    return version >= this.apiVersion && revision >= this.apiRevision;
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
    if (this.ws) {
      switch (this.ws.readyState) {
        case WebSocket.OPEN:
          return WebSocketStatus.Open;
      }
    }
    return WebSocketStatus.Closed;
  }

  reconnectWebSocketIfNeeded() {
    if (this.webSocketStatus === WebSocketStatus.Closed) {
      this.createWebSocket();
    }
  }

  createWebSocket() {
    this.clearWebSocketTimeoutHandle();
    if (this.retrieveSystemInformationSubscription) {
      // Cancels ongoing request to avoid connection flooding
      this.retrieveSystemInformationSubscription.unsubscribe();
    }
    this.retrieveSystemInformationSubscription = this.retrieveSystemInformation()
      .pipe(
        shareReplay(1),
        finalize(() => this.retrieveSystemInformationSubscription = null)
      )
      .subscribe(info => {
        if (this.ws) {
          // Removing listeners to avoid loop
          this.ws.onmessage = null;
          this.ws.onclose = null;
          this.ws.onerror = null;
          this.ws.close();
          this.webSocketStateChanged$.emit(WebSocketStatus.Closed);
        }
        const ws = this.ws = new WebSocket(`ws://${this.host}:${info.websocket_port}`);
        ws.onopen = () => {
          this.webSocketStateChanged$.emit(WebSocketStatus.Open);
        };
        ws.onmessage = this.readWebSocketMessage;
        ws.onerror = this.handleWebSocketError;
        ws.onclose = () => {
          this.webSocketStateChanged$.emit(WebSocketStatus.Closed);
          this.handleWebSocketError();
        };
      }, _ => this.handleWebSocketError());
  }

  private handleWebSocketError = () => {
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

  private readWebSocketMessage = (event: MessageEvent<any>) => {
    const reader = new FileReader();
    reader.onload = () => {
      const state = deserialize(JSON.parse(reader.result as string).results, State);
      this.handleStateChange(state);
    };
    reader.readAsText(event.data);
  };

  handleStateChange(state: State) {
    this.isTwelveHourTime = state.twelve;
    this.stateChanged$.emit(state);
  }
}
