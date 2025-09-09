import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  private subscriptions: Subscription[] = [];

  img: string;

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
      (view: any) => this.img = view.binary_image
    );
    this.subscriptions.push(getMainImageSubscription);
  }
}
