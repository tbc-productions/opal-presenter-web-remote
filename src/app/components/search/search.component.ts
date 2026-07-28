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
  public searchText: string = '';
  public searchResults: any = null;
  public isSearchButttonDisabled: boolean = true;
  public selectedPlugin: string = '';
  public selectedPluginName: string = '';
  public currentPlugin: string = '';
  public displaySearchOptions: boolean = false;
  @ViewChild(SearchOptionsComponent, {static: false}) searchOptions: SearchOptionsComponent = {} as SearchOptionsComponent;

  private normalizePluginKey(pluginKey: string | null): string {
    return (pluginKey || '').trim().toLowerCase();
  }

  comparePluginKeys = (pluginKeyA: string | null, pluginKeyB: string | null): boolean => {
    return this.normalizePluginKey(pluginKeyA) === this.normalizePluginKey(pluginKeyB);
  };

  getSelectedPluginName(): string {
    const normalizedSelectedPlugin = this.normalizePluginKey(this.selectedPlugin);
    const selectedPlugin = this.searchPlugins.find(
      plugin => this.normalizePluginKey(plugin.key) === normalizedSelectedPlugin
    );
    return selectedPlugin?.name || this.selectedPluginName || this.selectedPlugin;
  }

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
    const normalizedSelectedPluginKey = this.normalizePluginKey(this.selectedPlugin);
    if (!normalizedSelectedPluginKey) {
      this.selectedPlugin = 'songs';
    }

    const selectedPlugin = this.searchPlugins.find(
      plugin => this.normalizePluginKey(plugin.key) === this.normalizePluginKey(this.selectedPlugin)
    );
    if (selectedPlugin?.name) {
      this.selectedPluginName = selectedPlugin.name;
      localStorage.setItem('selectedPluginName', this.selectedPluginName);
    }

    if (this.selectedPlugin === 'bibles') {
      this.searchOptions.onPluginChange(this.selectedPlugin);
      this.displaySearchOptions = true;
    }
    else {
      if (this.displaySearchOptions) {
        this.displaySearchOptions = false;
      }
    }
    const normalizedPluginKey = this.normalizePluginKey(this.selectedPlugin);
    if (normalizedPluginKey) {
      localStorage.setItem('selectedPlugin', normalizedPluginKey);
    }
  }

  sendLive(id: number): void {
    this.openlpService.sendItemLive(this.currentPlugin, id).subscribe(() => {});
  }

  addToService(id: number): void {
    this.openlpService.addItemToService(this.currentPlugin, id).subscribe(() => {});
  }

  ngOnInit(): void {
    this.selectedPluginName = localStorage.getItem('selectedPluginName')?.trim() || this.translateService.instant('SONG');

    const changePageTitleSubscription = this.translateService.stream('SEARCH').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    const songLabelSubscription = this.translateService.stream('SONG').subscribe(
      (res: string) => {
        if (!this.searchPlugins.length && !localStorage.getItem('selectedPluginName')) {
          this.selectedPluginName = res;
        }
      }
    );
    const getSearchablePluginsSubscription = this.openlpService.getSearchablePlugins().subscribe(
      (items: PluginDescription[]) => {
        this.searchPlugins = items;

        const availablePlugins = new Map(
          this.searchPlugins.map(plugin => [this.normalizePluginKey(plugin.key), plugin.key])
        );

        // Ensure selected plugin is valid, otherwise fallback to songs.
        const normalizedSelectedPlugin = this.normalizePluginKey(this.selectedPlugin);
        if (availablePlugins.has(normalizedSelectedPlugin)) {
          this.selectedPlugin = availablePlugins.get(normalizedSelectedPlugin) || this.selectedPlugin;
        }
        else {
          this.selectedPlugin = availablePlugins.get('songs') || this.searchPlugins[0]?.key || 'songs';
        }
        this.selectedPluginName = this.searchPlugins.find(
          plugin => this.normalizePluginKey(plugin.key) === this.normalizePluginKey(this.selectedPlugin)
        )?.name || this.selectedPluginName;
        localStorage.setItem('selectedPlugin', this.selectedPlugin);
        localStorage.setItem('selectedPluginName', this.selectedPluginName);
      }
    );
    this.subscriptions.push(changePageTitleSubscription, songLabelSubscription, getSearchablePluginsSubscription);

    // Retrieve the last selected plugin. Set to 'songs' if it isn't set.
    const storedSelectedPlugin = this.normalizePluginKey(localStorage.getItem('selectedPlugin'));
    if (!storedSelectedPlugin) {
      localStorage.setItem('selectedPlugin', 'songs');
      this.selectedPlugin = 'songs';
    }
    else {
      this.selectedPlugin = storedSelectedPlugin;
    }
    this.selectedPluginName = localStorage.getItem('selectedPluginName')?.trim() || this.selectedPluginName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.onPluginChange();
    this.changeDetectorRef.detectChanges();
  }
}
