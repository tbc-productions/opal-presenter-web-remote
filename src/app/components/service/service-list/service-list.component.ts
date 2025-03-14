import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
  items: ServiceItem[] = [];
  _subscription: Subscription;
  loading = false;

  @Output() itemSelected = new EventEmitter<ServiceItem>();

  ngOnInit() {
    this.fetchServiceItems();
  }

  onItemSelected(item: ServiceItem) {
    this.itemSelected.emit(item);
  }

  fetchServiceItems() {
    this.loading = true;
    this.openlpService.getServiceItems().subscribe(items => {
      this.items = items;
      this.loading = false;
    });
  }

  constructor(private openlpService: OpenLPService) {
    this._subscription = openlpService.stateChanged$.subscribe(() => {
      this.fetchServiceItems();
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}

