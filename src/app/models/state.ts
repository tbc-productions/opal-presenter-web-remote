import { DisplayMode } from '../enums/display-mode.enum';

export class State {
  isAuthorized: boolean = false;
  version: number = 0;
  slide: number = 0;
  display: boolean = false;
  isSecure: boolean = false;
  blank: boolean = false;
  twelve: boolean = false;
  theme: boolean = false;
  item: string = '';

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
