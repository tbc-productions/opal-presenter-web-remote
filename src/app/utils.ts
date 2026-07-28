import { Type } from '@angular/core';

export function deserialize<T>(json: any, cls: Type<T>): T {
  const inst: any = new cls();
  for (const p in json) {
    if (!json.hasOwnProperty(p)) {
      continue;
    }
    inst[p] = json[p];
  }
  return inst;
}
