import { Component, inject, OnDestroy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { OpenLPService } from '../../../services/openlp.service';

@Component({
  selector: 'openlp-search-options',
  templateUrl: './search-options.component.html',
  styleUrl: './search-options.component.scss',
  providers: [OpenLPService],
  standalone: false
})
export class SearchOptionsComponent implements OnDestroy {
  private openlpService: OpenLPService = inject(OpenLPService);
  private subscriptions: Subscription[] = [];
  private titleCasePipe: TitleCasePipe = inject(TitleCasePipe);
  private translateService = inject(TranslateService);

  public selectedPlugin: string;
  public searchOptions: Array<string>;
  public selectedSearchOption: string;
  public searchOptionsTitle: string;

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
  // Used to display search-options for certain plugins
  onPluginChange(plugin: string): void {
    this.selectedPlugin = plugin;
    if (this.selectedPlugin === 'bibles') {
      const searchOptionsTitleSubscription = this.translateService.stream('BIBLE_VERSION').subscribe(
        (res: string) => {
          this.searchOptionsTitle = this.titleCasePipe.transform(res) + ':';
        }
      );
      this.subscriptions.push(searchOptionsTitleSubscription);
      this.getSearchOptions();
    }
  }

  getSearchOptions(): void {
    const searchOptionsSubscription = this.openlpService.getSearchOptions(this.selectedPlugin).subscribe(
      (res: any) => {
        if (this.selectedPlugin === 'bibles') {
          for (const option of res) {
            if (option.name === 'primary bible') {
              this.searchOptions = option['list'];
              this.selectedSearchOption = option['selected'];
              break;
            }
          }
        }
      }
    );
    this.subscriptions.push(searchOptionsSubscription);
  }

  setSearchOption(target: any): void {
    this.openlpService.setSearchOption(this.selectedPlugin, 'primary bible', target.value).subscribe(() => {});
    this.selectedSearchOption = target.value;
  }
}
