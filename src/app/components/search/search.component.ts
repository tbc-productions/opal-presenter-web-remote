import { AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

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
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private openlpService: OpenLPService = inject(OpenLPService);
  private pageTitleService: PageTitleService = inject(PageTitleService);
  private subscriptions: Subscription[] = [];
  private translateService: TranslateService = inject(TranslateService);

  public searchPlugins: PluginDescription[] = [];
  public searchText: string = null;
  public searchResults: any = null;
  public isSearchButttonDisabled: boolean = true;
  public selectedPlugin: string;
  public currentPlugin: string;
  public displaySearchOptions: boolean = false;
  @ViewChild(SearchOptionsComponent, {static: false}) searchOptions: SearchOptionsComponent;

  onSearch(): void {
    this.currentPlugin = this.selectedPlugin;
    this.openlpService.search(this.currentPlugin, this.searchText).subscribe(items => this.searchResults = items);
  }

  onSearchAll(): void {
    this.currentPlugin = this.selectedPlugin;
    this.openlpService.searchAll(this.currentPlugin).subscribe(items => this.searchResults = items);
  }

  onSearchTextChange(): void {
    this.isSearchButttonDisabled = this.searchText.trim() === '';
  }

  // Used to display search-options for certain plugins
  onPluginChange(): void {
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

  sendLive(id: number): void {
    this.openlpService.sendItemLive(this.currentPlugin, id).subscribe(() => {});
  }

  addToService(id: number): void {
    this.openlpService.addItemToService(this.currentPlugin, id).subscribe(() => {});
  }

  ngOnInit(): void {
    const changePageTitleSubscription = this.translateService.stream('SEARCH').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    const getSearchablePluginsSubscription = this.openlpService.getSearchablePlugins().subscribe(
      (items: PluginDescription[]) => this.searchPlugins = items
    );
    this.subscriptions.push(changePageTitleSubscription, getSearchablePluginsSubscription);

    // Retrieve the last selected plugin. Set to 'songs' if it isn't set.
    if (localStorage.getItem('selectedPlugin') === null) {
      localStorage.setItem('selectedPlugin', 'songs');
    }
    this.selectedPlugin = localStorage.getItem('selectedPlugin');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.onPluginChange();
    this.changeDetectorRef.detectChanges();
  }
}
