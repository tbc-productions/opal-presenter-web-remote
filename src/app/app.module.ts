import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSliderModule } from '@angular/material/slider';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { PageTitleService } from './page-title.service';
import { OpenLPService } from './openlp.service';
import { WindowRef } from './window-ref.service';
import { AppRoutingModule } from './app.routing';
import { ServiceComponent } from './components/service/service.component';
import { AlertComponent } from './components/alert/alert.component';
import { SearchComponent } from './components/search/search.component';
import { SearchOptionsComponent } from './components/search/search-options/search-options.component';
import { SlidesComponent } from './components/slides/slides.component';
import { ChordViewComponent } from './components/chord-view/chord-view.component';
import { StageViewComponent } from './components/stage-view/stage-view.component';
import { Nl2BrPipe } from './components/stage-view/nl2br.pipe';
import { MainViewComponent } from './components/main-view/main-view.component';
import { ChordProPipe } from './components/chord-view/chordpro.pipe';
import { LoginComponent } from './components/login/login.component';
import { ThemesComponent } from './components/themes/themes.component';
import { SlideListComponent } from './components/slides/slide-list/slide-list.component';
import { SlideItemComponent } from './components/slides/slide-item/slide-item.component';
import { ServiceItemComponent } from './components/service/service-item/service-item.component';
import { ServiceListComponent } from './components/service/service-list/service-list.component';
import { ChordViewItemComponent } from './components/chord-view/chord-view-item/chord-view-item.component';
import { StageViewItemComponent } from './components/stage-view/stage-view-item/stage-view-item.component';
import { DisplayModeSelectorComponent } from './components/display-mode-selector/display-mode-selector.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StageChordPreviewComponent } from './components/settings/stage-chord-preview/stage-chord-preview.component';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ChordViewComponent,
    StageViewComponent,
    StageViewItemComponent,
    ChordViewItemComponent,
    Nl2BrPipe,
    MainViewComponent,
    ChordProPipe,
    LoginComponent,
    ServiceComponent,
    ServiceListComponent,
    ServiceItemComponent,
    AlertComponent,
    SearchComponent,
    SearchOptionsComponent,
    SlidesComponent,
    SlideListComponent,
    SlideItemComponent,
    ThemesComponent,
    DisplayModeSelectorComponent,
    SettingsComponent,
    StageChordPreviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatSliderModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    PageTitleService,
    OpenLPService,
    Title,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
