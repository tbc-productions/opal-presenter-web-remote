import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Slide } from '../../../responses';

@Component({
    selector: 'app-chord-view-item',
    templateUrl: './chord-view-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChordViewItemComponent {
    @Input() slide: Slide;
    @Input() active = false;

    chordproFormatted(slide: Slide): string {
        if (!slide) {
            return '';
        }
        let chordpro: string = slide.chords;
        chordpro = chordpro.replace(/<br>/g, '\n');

        return chordpro;
    }
}
