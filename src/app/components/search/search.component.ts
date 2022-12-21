import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { OpenLPService } from '../../openlp.service';
import { PageTitleService } from '../../page-title.service';
import { PluginDescription } from '../../responses';
import { SearchOptionsComponent } from './search-options/search-options.component';

@Component({
  selector: 'openlp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [OpenLPService]
})
export class SearchComponent implements OnInit, AfterViewInit {
  public searchPlugins: PluginDescription[] = [];
  public searchText = null;
  public searchResults = null;
  public selectedPlugin: string;
  public currentPlugin: string;
  public displaySearchOptions = false;
  @ViewChild(SearchOptionsComponent, {static: false}) searchOptions: SearchOptionsComponent;

  constructor(private pageTitleService: PageTitleService, private openlpService: OpenLPService,
              private cdr: ChangeDetectorRef) {
    pageTitleService.changePageTitle('Search');
  }

  onSubmit() {
    this.currentPlugin = this.selectedPlugin;
    this.openlpService.search(this.currentPlugin, this.searchText).subscribe(items => this.searchResults = items);
  }

  // Used to display search-options for certain plugins
  onPluginChange() {
    if (this.selectedPlugin === 'bibles') {
      this.searchOptions.onPluginChange(this.selectedPlugin);
      this.displaySearchOptions = true;
    }
    else {
      if (this.displaySearchOptions) {
        this.displaySearchOptions = false;
      }
    }
    localStorage.setItem('selectedPlugin', this.selectedPlugin);
  }

  sendLive(id) {
    this.openlpService.sendItemLive(this.currentPlugin, id).subscribe(res => {});
  }

  addToService(id) {
    this.openlpService.addItemToService(this.currentPlugin, id).subscribe(res => {});
  }

  ngOnInit() {
    this.openlpService.getSearchablePlugins().subscribe(items => this.searchPlugins = items);

    // Retrieve the last selected plugin. Set to 'songs' if it isn't set.
    if (localStorage.getItem('selectedPlugin') === null) {
      localStorage.setItem('selectedPlugin', 'songs');
    }
    this.selectedPlugin = localStorage.getItem('selectedPlugin');
  }

  ngAfterViewInit() {
    this.onPluginChange();
    this.cdr.detectChanges();
  }
}
