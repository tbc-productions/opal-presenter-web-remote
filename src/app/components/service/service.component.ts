import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';
import { SettingsService } from '../../services/settings.service';
import { WindowRef } from '../../services/window-ref.service';
import { ServiceItem } from '../../interfaces/service-item.interface';
import { SlideListItem } from '../slides/slide-list/slide-list.component';

const MIN_PIXEL_WIDTH_FOR_SERVICE_SLIDES_PANEL = 1200;

@Component({
  selector: 'openlp-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  standalone: false
})

export class ServiceComponent implements OnInit, OnDestroy {
  protected pageTitleService: PageTitleService = inject(PageTitleService);
  protected openlpService: OpenLPService = inject(OpenLPService);
  protected router: Router = inject(Router);
  protected canShowSideBySideSlides: boolean = false;
  protected showSlidesInSidePanel: boolean = false;
  private showSlidesInSidePanelPreference: boolean = false;
  private subscriptions: Subscription[] = [];
  private settingsService: SettingsService = inject(SettingsService);
  private translateService: TranslateService = inject(TranslateService);
  private windowRef: WindowRef = inject(WindowRef);

  onItemSelected(item: ServiceItem): void {
    if (item.is_valid) {
      this.openlpService.setServiceItem(item.id).subscribe();
      if (!this.showSlidesInSidePanel || !this.canShowSideBySideSlides) {
        this.router.navigate(['slides']);
      }
    }
  }

  onSlideSelected(item: SlideListItem): void {
    this.openlpService.setSlide(item.index).subscribe();
  }

  ngOnInit(): void {
    this.showSlidesInSidePanelPreference = this.settingsService.get('serviceShowSlidesPanel') ?? false;
    this.updateSideBySideAvailability();
    const serviceShowSlidesPanelChangedSubscription = this.settingsService
      .onPropertyChanged('serviceShowSlidesPanel')
      .subscribe((value: boolean | undefined) => {
        this.showSlidesInSidePanelPreference = value ?? false;
        this.syncSideBySideSlidesState();
      });
    const changePageTitleSubscription = this.translateService.stream('SERVICE').subscribe(
      (res: string) => {
        this.pageTitleService.changePageTitle(res);
      }
    );
    this.subscriptions.push(serviceShowSlidesPanelChangedSubscription, changePageTitleSubscription);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateSideBySideAvailability();
  }

  private updateSideBySideAvailability(): void {
    this.canShowSideBySideSlides = this.windowRef.nativeWindow.innerWidth >= MIN_PIXEL_WIDTH_FOR_SERVICE_SLIDES_PANEL;
    this.syncSideBySideSlidesState();
  }

  private syncSideBySideSlidesState(): void {
    this.showSlidesInSidePanel = this.canShowSideBySideSlides && this.showSlidesInSidePanelPreference;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
