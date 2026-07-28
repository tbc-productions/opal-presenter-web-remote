import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { OpenLPService } from '../../../services/openlp.service';
import { ServiceItem } from '../../../interfaces/service-item.interface';

@Component({
  selector: 'openlp-service-item',
  templateUrl: './service-item.component.html',
  styleUrl: './service-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class ServiceItemComponent implements OnInit, OnDestroy {
  private dialog: MatDialog = inject(MatDialog);
  private openlpService: OpenLPService = inject(OpenLPService);
  private subscriptions: Subscription[] = [];

  @Input() item: ServiceItem = {} as ServiceItem;
  @Input() selected = false;
  @Output() selectItem = new EventEmitter<ServiceItem>();

  useDeleteServiceItemFromOpenlp: boolean = false;

  ngOnInit(): void {
    this.useDeleteServiceItemFromOpenlp = this.openlpService.assertApiVersionMinimum(2, 6);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onItemSelected(item: ServiceItem): void {
    this.selectItem.emit(item);
  }

  getIcon(item: ServiceItem): string {
    if (!item.is_valid) {
      return 'delete';
    } else if (item.plugin === 'songs') {
      return 'queue_music';
    } else if (item.plugin === 'images') {
      return 'image';
    } else if (item.plugin === 'bibles') {
      return 'book';
    } else if (item.plugin === 'media') {
      return 'movie';
    } else if (item.plugin === 'custom') {
      return 'description';
    } else if (item.plugin === 'presentations') {
      return 'slideshow';
    }
    return 'crop_square';
  }

  deleteFromService(item: ServiceItem): void {
    if (item.is_valid) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        autoFocus: true,
        disableClose: true
      });
      const dialogRefSubscription = dialogRef.afterClosed().subscribe(
        (result: boolean) => {
          if (result) {
            this.openlpService.setServiceItem(item.id).subscribe(() =>
              this.openlpService.deleteItemFromService().subscribe()
            );
          }
        }
      );
      this.subscriptions.push(dialogRefSubscription);
    }
  }
}
