import { TranslateLoader } from '@ngx-translate/core';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class TranslationService implements TranslateLoader {
  private http: HttpClient = inject(HttpClient);

  getTranslation(language: string): Observable<any> {
    return this.http.get(language === 'default' ? '/assets/en.json' : '/assets/i18n/' + language + '.json');
  }
}
