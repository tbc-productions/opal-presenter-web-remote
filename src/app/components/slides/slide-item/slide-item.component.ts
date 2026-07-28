import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Slide } from '../../../interfaces/slide.interface';

@Component({
  selector: 'openlp-slide-item',
  templateUrl: './slide-item.component.html',
  styleUrl: './slide-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class SlideItemComponent {
  @Input() slide: Slide = {} as Slide;
  @Input() selected = false;
  @Output() selectSlide = new EventEmitter<Slide>();

  onSlideSelected(slide: Slide): void {
    this.selectSlide.emit(slide);
  }
}

