import { Service } from '@angular/core';

function _window(): any {
  return window;
}

@Service()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }
}
