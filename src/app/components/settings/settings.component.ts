import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OpenLPService } from '../../openlp.service';
import { PageTitleService } from '../../page-title.service';
import { SettingsProperties, SettingsPropertiesItem, SettingsService } from '../../settings.service';

@Component({
    selector: 'openlp-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnDestroy {
  constructor(
    protected pageTitleService: PageTitleService,
    protected openlpService: OpenLPService,
    protected settingsService: SettingsService,
    private translateService: TranslateService) {
    this.settingsSubscription$ = settingsService.settingChanged$.subscribe(this._settingChanged);
    this.translateService.stream('SETTINGS').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
  }

  protected settingsSubscription$: Subscription;

  settings: Partial<SettingsProperties> = this.settingsService.getAll();

  setSetting<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(property: SP, value: SV) {
    this.settingsService.set(property, value);
  }

  _settingChanged = <SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(
    value: SettingsPropertiesItem<SP, SV>
  ) => {
    this.settings = {...this.settings, [value.property]: value.value};
  };

  ngOnDestroy(): void {
      this.settingsSubscription$.unsubscribe();
  }
}
