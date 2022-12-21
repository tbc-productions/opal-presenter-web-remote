import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Slide } from '../../../responses';

@Component({
  selector: 'openlp-slide-item',
  templateUrl: './slide-item.component.html',
  styleUrls: ['./slide-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlideItemComponent {
  @Input() slide: Slide;
  @Input() selected = false;
  @Output() selectSlide = new EventEmitter<Slide>();

  onSlideSelected(slide: Slide) {
    this.selectSlide.emit(slide);
  }
}

