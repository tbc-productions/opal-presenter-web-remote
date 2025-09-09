import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class PageTitleService {
  private titleService: Title = inject(Title);
  private titleCasePipe: TitleCasePipe = inject(TitleCasePipe);

  private pageTitleSource = new Subject<string>();
  public pageTitleChanged$ = this.pageTitleSource.asObservable();

  changePageTitle(pageTitle: string): void {
    this.pageTitleSource.next(pageTitle);
    this.titleService.setTitle(this.titleCasePipe.transform(pageTitle) + ' | OpenLP Remote');
  }
}
