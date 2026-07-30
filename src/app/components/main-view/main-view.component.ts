import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OpenLPService } from '../../services/openlp.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss', '../overlay.scss'],
  standalone: false
})
export class MainViewComponent implements OnInit, OnDestroy {
  private openlpService: OpenLPService = inject(OpenLPService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private subscriptions: Subscription[] = [];

  overlayImage: any = null;

  ngOnInit(): void {
    this.updateImage();
    const stateChangedSubscription = this.openlpService.stateChanged$.subscribe(
      () => this.updateImage()
    );
    this.subscriptions.push(stateChangedSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateImage(): void {
    const getMainImageSubscription = this.openlpService.getMainImage().subscribe(
      (view: any) => { if (view) { this.overlayImage = view.binary_image; this.changeDetectorRef.markForCheck(); } }
    );
    this.subscriptions.push(getMainImageSubscription);
  }
}
