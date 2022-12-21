import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Slide } from '../../../responses';

@Component({
    selector: 'app-stage-view-item',
    templateUrl: './stage-view-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageViewItemComponent {
    @Input() slide: Slide;
    @Input() active = false;
}
