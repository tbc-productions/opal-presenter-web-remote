
import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export function createWebSocket<T>(
  host: string,
  wsPort: number,
  deserialize: (input: string) => T,
  endpoint = ''
): Observable<T> {
  return new Observable((observer) => {
    const ws = new WebSocket(`ws://${host}:${wsPort}/${endpoint}`);
    ws.onmessage = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = deserialize(JSON.parse(reader.result as string));
        observer.next(data);
      };
      reader.readAsText(e.data);
    };
    ws.onerror = () => {
      observer.error();
    };
    ws.onclose = () => {
      observer.complete();
    };

    return () => {
      // Removing listeners to avoid loop
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
    };
  });
}
