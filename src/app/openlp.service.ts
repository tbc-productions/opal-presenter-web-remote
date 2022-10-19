import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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


@Injectable()
export class OpenLPService {
  private apiURL: string;
  public stateChanged$: EventEmitter<State>;
  private isTwelveHourTime = true;

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

    this.stateChanged$ = new EventEmitter<State>();
    this.retrieveSystemInformation().subscribe(info => {
      const ws = new WebSocket(`ws://${host}:${info.websocket_port}`);
      ws.onmessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          const state = deserialize(JSON.parse(reader.result as string).results, State);
          this.isTwelveHourTime = state.twelve;
          this.stateChanged$.emit(state);
        };
        reader.readAsText(event.data);
      };
    });
  }

  setAuthToken(token: string): void {
    httpOptions.headers = httpOptions.headers.set('Authorization', token);
  }

  getIsTwelveHourTime(): boolean {
    return this.isTwelveHourTime;
  }

  retrieveSystemInformation(): Observable<SystemInformation> {
    return this.http.get<SystemInformation>(`${this.apiURL}/core/system`, httpOptions);
  }

  getMainImage(): Observable<MainView> {
    return this.http.get<MainView>(`${this.apiURL}/core/live-image`, httpOptions);
  }

  getSearchablePlugins(): Observable<PluginDescription[]> {
    return this.http.get<PluginDescription[]>(`${this.apiURL}/core/plugins`, httpOptions);
  }

  search(plugin, text): Observable<any> {
    return this.http.get(`${this.apiURL}/plugins/${plugin}/search?text=${text}`, httpOptions);
  }

  getSearchOptions(plugin): Observable<any> {
    return this.http.get(`${this.apiURL}/plugins/${plugin}/search-options`, httpOptions);
  }

  setSearchOption(plugin, option, value): Observable<any> {
    return this.http.post(`${this.apiURL}/plugins/${plugin}/search-options`, {'option': option, 'value': value}, httpOptions);
  }

  getServiceItems(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.apiURL}/service/items`, httpOptions);
  }

  setServiceItem(id: any): Observable<any> {
    return this.http.post(`${this.apiURL}/service/show`, {'id': id}, httpOptions);
  }

  nextItem(): Observable<any> {
    return this.http.post(`${this.apiURL}/service/progress`, {'action': 'next'}, httpOptions);
  }

  previousItem(): Observable<any> {
    return this.http.post(`${this.apiURL}/service/progress`, {'action': 'previous'}, httpOptions);
  }

  getServiceItem(): Observable<any> {
    return this.http.get<Slide[]>(`${this.apiURL}/controller/live-items`, httpOptions);
  }

  getNotes(): Observable<any> {
    return this.http.get(`${this.apiURL}/controller/notes`, httpOptions);
  }

  setSlide(id: any): Observable<any> {
    return this.http.post(`${this.apiURL}/controller/show`, {'id': id}, httpOptions);
  }

  nextSlide(): Observable<any> {
    return this.http.post(`${this.apiURL}/controller/progress`, {'action': 'next'}, httpOptions);
  }

  previousSlide(): Observable<any> {
    return this.http.post(`${this.apiURL}/controller/progress`, {'action': 'previous'}, httpOptions);
  }

  getThemeLevel(): Observable<any> {
    return this.http.get(`${this.apiURL}/controller/theme-level`, httpOptions);
  }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.apiURL}/controller/themes`, httpOptions);
  }

  setThemeLevel(level): Observable<any> {
    return this.http.post(`${this.apiURL}/controller/theme-level`, {'level': level}, httpOptions);
  }

  getTheme(): Observable<any> {
    return this.http.get(`${this.apiURL}/controller/theme`, httpOptions);
  }

  setTheme(theme: string): Observable<any> {
    return this.http.post(`${this.apiURL}/controller/theme`, {'theme': theme}, httpOptions);
  }

  blankDisplay(): Observable<any> {
    return this.http.post(`${this.apiURL}/core/display`, {'display': 'blank'}, httpOptions);
  }

  themeDisplay(): Observable<any> {
    return this.http.post(`${this.apiURL}/core/display`, {'display': 'theme'}, httpOptions);
  }

  desktopDisplay(): Observable<any> {
    return this.http.post(`${this.apiURL}/core/display`, {'display': 'desktop'}, httpOptions);
  }

  showDisplay(): Observable<any> {
    return this.http.post(`${this.apiURL}/core/display`, {'display': 'show'}, httpOptions);
  }

  showAlert(text): Observable<any> {
    return this.http.post(`${this.apiURL}/plugins/alerts`, {'text': text}, httpOptions);
  }

  sendItemLive(plugin, id): Observable<any> {
    return this.http.post(`${this.apiURL}/plugins/${plugin}/live`, {'id': id}, httpOptions);
  }

  addItemToService(plugin, id): Observable<any> {
    return this.http.post(`${this.apiURL}/plugins/${plugin}/add`, {'id': id}, httpOptions);
  }

  transposeSong(transpose_value): Observable<any> {
    return this.http.get(`${this.apiURL}/plugins/songs/transpose-live-item/${transpose_value}`, httpOptions);
  }

  login(credentials: Credentials): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.apiURL}/core/login`, credentials, httpOptions);
  }
}
