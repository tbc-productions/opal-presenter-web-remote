import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { OpenLPService } from '../../../services/openlp.service';
import { ServiceItem } from '../../../interfaces/service-item.interface';

@Component({
  selector: 'openlp-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss', '../../no-items.scss'],
  standalone: false
})

export class ServiceListComponent implements OnInit, OnDestroy {
  private openlpService: OpenLPService = inject(OpenLPService);
  private subscriptions: Subscription[] = [];

  items: ServiceItem[] = [];
  loading: boolean = false;

  @Output() itemSelected = new EventEmitter<ServiceItem>();

  ngOnInit(): void {
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      () => {
        this.fetchServiceItems();
      }
    );
    this.subscriptions.push(stateChangedSubscription);
    this.fetchServiceItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onItemSelected(item: ServiceItem): void {
    this.itemSelected.emit(item);
  }

  fetchServiceItems(): void  {
    this.loading = true;
    const getServiceItemsSubscription = this.openlpService.getServiceItems().subscribe(
      (items: ServiceItem[]) => {
        this.items = items;
        this.loading = false;
      }
    );
    this.subscriptions.push(getServiceItemsSubscription);
  }
}
