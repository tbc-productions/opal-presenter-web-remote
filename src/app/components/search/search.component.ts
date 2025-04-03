import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { PluginDescription } from '../../interfaces/plugin-description.interface';
import { SearchOptionsComponent } from './search-options/search-options.component';

@Component({
    selector: 'openlp-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    providers: [OpenLPService],
    standalone: false
})
export class SearchComponent implements OnInit, AfterViewInit {
  public searchPlugins: PluginDescription[] = [];
  public searchText: string = null;
  public searchResults = null;
  public isSearchButttonDisabled = true;
  public selectedPlugin: string;
  public currentPlugin: string;
  public displaySearchOptions = false;
  @ViewChild(SearchOptionsComponent, {static: false}) searchOptions: SearchOptionsComponent;

  constructor(
    private pageTitleService: PageTitleService,
    private openlpService: OpenLPService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService) {
    this.translateService.stream('SEARCH').subscribe(res => {
      this.pageTitleService.changePageTitle(res);
    });
  }

  onSearch() {
    this.currentPlugin = this.selectedPlugin;
    this.openlpService.search(this.currentPlugin, this.searchText).subscribe(items => this.searchResults = items);
  }

  onSearchAll() {
    this.currentPlugin = this.selectedPlugin;
    this.openlpService.searchAll(this.currentPlugin).subscribe(items => this.searchResults = items);
  }

  onSearchTextChange() {
    this.isSearchButttonDisabled = this.searchText.trim() === '';
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

  sendLive(id: number) {
    this.openlpService.sendItemLive(this.currentPlugin, id).subscribe(() => {});
  }

  addToService(id: number) {
    this.openlpService.addItemToService(this.currentPlugin, id).subscribe(() => {});
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
