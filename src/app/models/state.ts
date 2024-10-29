import { DisplayMode } from '../enums/display-mode.enum';

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
