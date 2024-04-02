import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'shortcut'})
export class ShortcutPipe implements PipeTransform {
    transform(value: string): string {
      if (!value) {
        return value;
      }
      if (typeof value !== 'string') {
        throw Error(`Invalid pipe argument: '${value}' for pipe 'ShortcutPipe'`);
      }
      value = value.replace('.', 'code.period');
      value = value.replace('PgUp', 'pageup');
      value = value.replace('PgDown', 'pagedown');
      value = value.replace('Up', 'arrowup');
      value = value.replace('Down', 'arrowdown');
      value = value.replace('Left', 'arrowleft');
      value = value.replace('Right', 'arrowright');
      value = value.replace(/(Alt|Shift)\+/, '$1.');
      value = value.replace(/Ctrl\+/, 'control.');
      return value.toLowerCase();
    }
}
