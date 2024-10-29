import { TranslateLoader } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TranslationService implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(language: string): Observable<any> {
    return this.http.get(language === 'default' ? '/assets/en.json' : '/assets/i18n/' + language + '.json');
  }
}
