import { Component, OnInit } from '@angular/core';
import { OpenLPService } from '../../services/openlp.service';

@Component({
    selector: 'app-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.scss', '../overlay.scss'],
    standalone: false
})
export class MainViewComponent implements OnInit {
  img: string;
  constructor(private openlpService: OpenLPService) { }

  ngOnInit() {
    this.updateImage();
    this.openlpService.stateChanged$.subscribe(() => this.updateImage());
  }

  updateImage(): void {
    this.openlpService.getMainImage().subscribe(view => this.img = view.binary_image);
  }

}
