import { Component } from '@angular/core';

import { OpenLPService } from '../../../openlp.service';

@Component({
  selector: 'openlp-search-options',
  templateUrl: './search-options.component.html',
  styleUrl: './search-options.component.scss',
  providers: [OpenLPService]
})
export class SearchOptionsComponent {
  public selectedPlugin: string;
  public searchOptions: Array<string>;
  public selectedSearchOption: string;
  public searchOptionsTitle = '';

  constructor(private openlpService: OpenLPService) {}

  // Used to display search-options for certain plugins
  onPluginChange(plugin) {
    this.selectedPlugin = plugin;
    if (this.selectedPlugin === 'bibles') {
      this.searchOptionsTitle = 'Bible version:';
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
