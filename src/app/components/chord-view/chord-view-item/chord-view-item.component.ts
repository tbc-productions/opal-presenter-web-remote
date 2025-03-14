import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Slide } from '../../../interfaces/slide.interface';

@Component({
    selector: 'app-chord-view-item',
    templateUrl: './chord-view-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
