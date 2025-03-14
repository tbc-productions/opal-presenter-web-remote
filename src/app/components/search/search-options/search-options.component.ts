import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../../services/openlp.service';

@Component({
    selector: 'openlp-search-options',
    templateUrl: './search-options.component.html',
    styleUrl: './search-options.component.scss',
    providers: [OpenLPService],
    standalone: false
})
export class SearchOptionsComponent {
  public selectedPlugin: string;
  public searchOptions: Array<string>;
  public selectedSearchOption: string;
  public searchOptionsTitle: string;

  constructor(
    private openlpService: OpenLPService,
    private titleCasePipe: TitleCasePipe,
    private translateService: TranslateService) { }

  // Used to display search-options for certain plugins
  onPluginChange(plugin) {
    this.selectedPlugin = plugin;
    if (this.selectedPlugin === 'bibles') {
      this.translateService.stream('BIBLE_VERSION').subscribe(res => {
        this.searchOptionsTitle = this.titleCasePipe.transform(res) + ':';
      });
      this.getSearchOptions();
    }
  }

  getSearchOptions() {
    this.openlpService.getSearchOptions(this.selectedPlugin).subscribe(res => {
      if (this.selectedPlugin === 'bibles') {
        for (const option of res) {
          if (option.name === 'primary bible') {
            this.searchOptions = option['list'];
            this.selectedSearchOption = option['selected'];
            break;
          }
        }
      }
    });
  }

  setSearchOption(target) {
    this.openlpService.setSearchOption(this.selectedPlugin, 'primary bible', target.value).subscribe(() => {});
    this.selectedSearchOption = target.value;
  }
}
