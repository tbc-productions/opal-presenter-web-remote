import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable()
export class PageTitleService {
  private pageTitleSource = new Subject<string>();
  public pageTitleChanged$ = this.pageTitleSource.asObservable();

  constructor(
    private titleService: Title,
    private titleCasePipe: TitleCasePipe) {}

  changePageTitle(pageTitle: string) {
    this.pageTitleSource.next(pageTitle);
    this.titleService.setTitle(this.titleCasePipe.transform(pageTitle) + ' | OpenLP Remote');
  }
}
