import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SettingsProperties, SettingsService } from '../../../services/settings.service';

@Component({
    selector: 'openlp-stage-chord-preview',
    templateUrl: './stage-chord-preview.component.html',
    styleUrl: './stage-chord-preview.component.scss',
    standalone: false
})
export class StageChordPreviewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    constructor(
        protected settingsService: SettingsService,
        protected ref: ChangeDetectorRef
    ) {
        this.windowResizeSubscription$ = fromEvent(window, 'resize')
            .pipe(debounceTime(300))
            .subscribe(() => this._resizeElement());
    }

    @Input() stageType: 'stage' | 'chords' = 'stage';
    @ViewChild('stageView', {read: ElementRef}) stageView: ElementRef<HTMLElement>;
    @ViewChild('chordsView', {read: ElementRef}) chordsView: ElementRef<HTMLElement>;
    @ViewChild('stageViewContainer') stageViewContainer: ElementRef<HTMLElement>;
    fontScale: number;
    protected windowResizeSubscription$: Subscription;
    protected settingChangedSubscription$: Subscription;

    ngOnInit(): void {
        this.fontScale = this.settingsService.get(
            this.stageType + 'FontScale' as keyof SettingsProperties
        ) as number / 100;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['stageType'].currentValue !== changes['stageType'].previousValue) {
            this.settingChangedSubscription$?.unsubscribe();
            this.settingChangedSubscription$ = this.settingsService
                .onPropertyChanged(changes['stageType'].currentValue + 'FontScale' as keyof SettingsProperties)
                .subscribe(value => {
                    this.fontScale = value as number / 100;
                    this.ref.detectChanges();
                });
        }
    }

    ngAfterViewInit(): void {
        if (this._getStageViewElement()?.nativeElement) {
            this._resizeElement();
        }
    }

    ngOnDestroy(): void {
        this.windowResizeSubscription$?.unsubscribe();
        this.settingChangedSubscription$?.unsubscribe();
    }

    _getStageViewElement() {
        switch (this.stageType) {
            case 'stage':
                return this.stageView;
            case 'chords':
                return this.chordsView;
        }
    }

    _resizeElement() {
        const viewElement = this._getStageViewElement();
        if (this.stageViewContainer?.nativeElement && viewElement?.nativeElement) {
            // Resetting container to 100% width before calculating
            this.stageViewContainer.nativeElement.style.width = '100%';
            this.stageViewContainer.nativeElement.style.height = 'auto';
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const {width: containerWidth} = this.stageViewContainer?.nativeElement.getBoundingClientRect();

            let zoomScale = containerWidth / windowWidth;
            const targetContainerHeight = containerWidth  * (windowHeight / windowWidth);
            let scaleTranslate = '';

            if (targetContainerHeight > (windowHeight * 0.6)) {
                zoomScale *= 0.5;
                scaleTranslate = ' translateX(50%)';
            }

            // Setting the container width + height to scale after
            this.stageViewContainer.nativeElement.style.width = (windowWidth * zoomScale) + 'px';
            this.stageViewContainer.nativeElement.style.height = (windowHeight * zoomScale) + 'px';

            viewElement.nativeElement.style.width = windowWidth + 'px';
            viewElement.nativeElement.style.height = windowHeight + 'px';
            viewElement.nativeElement.style.transform = `scale(${zoomScale})${scaleTranslate}`;
        }
    }
}
