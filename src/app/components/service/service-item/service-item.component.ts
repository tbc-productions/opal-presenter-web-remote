import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ServiceItem } from '../../../responses';

@Component({
  selector: 'openlp-service-item',
  templateUrl: './service-item.component.html',
  styleUrl: './service-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ServiceItemComponent {
  @Input() item: ServiceItem;
  @Input() selected = false;
  @Output() selectItem = new EventEmitter<ServiceItem>();

  onItemSelected(item: ServiceItem) {
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

}
