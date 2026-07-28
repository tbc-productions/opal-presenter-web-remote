import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Slide } from '../../../interfaces/slide.interface';

@Component({
  selector: 'app-stage-view-item',
  templateUrl: './stage-view-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class StageViewItemComponent {
  @Input() slide: Slide = {} as Slide;
  @Input() active: boolean = false;
}
