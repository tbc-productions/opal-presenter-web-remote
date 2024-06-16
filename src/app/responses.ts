export interface PluginDescription {
  key: string;
  name: string;
}

export class State {
  isAuthorized: boolean;
  version: number;
  slide: number;
  display: boolean;
  isSecure: boolean;
  blank: boolean;
  twelve: boolean;
  theme: boolean;
  item: string;

  live = () => !(this.blank || this.display || this.theme);

  get displayMode() {
    if (this.blank) {
      return DisplayMode.Blank;
    } else if (this.display) {
      return DisplayMode.Desktop;
    } else if (this.theme) {
      return DisplayMode.Theme;
    } else {
      return DisplayMode.Presentation;
    }
  }
}

export class Display {
  bigDisplayButtons: boolean;
  darkTheme: boolean;
  displayMode: DisplayMode;
}

export enum DisplayMode {
  Blank,
  Theme,
  Desktop,
  Presentation
}

export interface Slide {
  selected: boolean;
  html: string;
  tag: string;
  text: string;
  chords: string;
  lines: string[];
  first_slide_of_tag: boolean;
  img: string;
}

export interface ServiceItem {
  id: string;
  notes: string;
  plugin: string;
  selected: boolean;
  title: string;
  is_valid: boolean;
  slides: object[];
}

export interface Theme {
  name: string;
  selected: boolean;
  thumbnail: object;
}

export interface Language {
  language: string;
}

export interface MainView {
  binary_image: string;
}

export interface Shortcut {
  action: string;
  shortcut: string[];
}

export interface SystemInformation {
  websocket_port: number;
  login_required: boolean;
  api_version?: number;
  api_revision?: number;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
}

export class Message<T extends MessageType> {
  plugin: T['plugin'];
  key: T['key'];
  value: T['value'];
}

export interface MessageType {
  plugin: string;
  key: string;
  value: any;
}
