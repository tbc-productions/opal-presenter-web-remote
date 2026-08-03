import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { Theme } from '../../interfaces/theme.interface';

@Component({
  selector: 'openlp-themes',
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.scss',
  providers: [OpenLPService],
  standalone: false
})
export class ThemesComponent implements OnInit, OnDestroy {
  private openlpService: OpenLPService = inject(OpenLPService);
  private pageTitleService: PageTitleService = inject(PageTitleService);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);

  private _themeList: Theme[] = [];
  private _themeLevel: string | null = null;

  ngOnInit(): void {
    const changePageTitleSubscription = this.translateService.stream('THEMES').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    this.subscriptions.push(changePageTitleSubscription);
    this.getThemeLevel();
    this.getThemes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get themeList(): Array<Theme> {
    return this._themeList;
  }

  get themeLevel(): string | null {
    return this._themeLevel;
  }

  set themeLevel(level: string) {
    this._themeLevel = level;
    this.openlpService.setThemeLevel(level).subscribe(
      () => this.getTheme()
    );
  }

  isThemeLevelSupported(): boolean {
    return this._themeLevel !== 'song';
  }

  getThemeLevel(): void {
    this.openlpService.getThemeLevel().subscribe(
      (themeLevel: string) => this._themeLevel = themeLevel
    );
  }

  getThemes(): void {
    this.openlpService.getThemes().subscribe(
      (themeList: Theme[]) => this._themeList = themeList
    );
  }

  getTheme(): void {
    this.openlpService.getTheme().subscribe(
      (theme: string) => {
        // Modify the theme list with the current theme. We do this instead of getting all the themes again
        // We do this here to ensure that the program is the only source of truth for the current theme
        for (const i of this._themeList) {
          if ((i.name === theme) && (i.selected === false)) {
            i.selected = true;
          } else if ((i.name !== theme) && (i.selected === true)) {
            i.selected = false;
          }
        }
      }
    );
  }

  setTheme(themeName: string): void {
    this.openlpService.setTheme(themeName).subscribe(
      () => this.getTheme()
    );
  }
}
