import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Service()
export class TranslationService implements TranslateLoader {
  private http: HttpClient = inject(HttpClient);

  getTranslation(language: string): Observable<any> {
    return this.http.get(language === 'default' ? '/assets/en.json' : '/assets/i18n/' + language + '.json');
  }
}
