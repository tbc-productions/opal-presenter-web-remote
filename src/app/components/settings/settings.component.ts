import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { SettingsProperties, SettingsPropertiesItem, SettingsService } from '../../services/settings.service';

@Component({
  selector: 'openlp-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: false
})
export class SettingsComponent implements OnInit, OnDestroy {
  protected pageTitleService: PageTitleService = inject(PageTitleService);
  protected openlpService: OpenLPService = inject(OpenLPService);
  protected settingsService: SettingsService = inject(SettingsService);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);

  settings: Partial<SettingsProperties> = this.settingsService.getAll();

  setSetting<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(property: SP, value: SV): void {
    this.settingsService.set(property, value);
  }

  getFontScale(prefix: 'stage' | 'chords'): number {
    return prefix === 'stage'
      ? this.settings.stageFontScale ?? 100
      : this.settings.chordsFontScale ?? 100;
  }

  setFontScale(prefix: 'stage' | 'chords', value: number): void {
    this.setSetting(prefix === 'stage' ? 'stageFontScale' : 'chordsFontScale', value);
  }

  _settingChanged = <SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(
    value: SettingsPropertiesItem<SP, SV>
  ) => {
    this.settings = {...this.settings, [value.property]: value.value};
  };

  ngOnInit(): void {
    const settingChangedSubscription = this.settingsService.settingChanged$.subscribe(this._settingChanged);
    const changePageTitleSubscription = this.translateService.stream('SETTINGS').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    this.subscriptions.push(settingChangedSubscription, changePageTitleSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
