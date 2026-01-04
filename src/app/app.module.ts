import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './app.component';
import { ChordProPipe } from './pipes/chordpro.pipe';
import { ChordViewComponent } from './components/chord-view/chord-view.component';
import { ChordViewItemComponent } from './components/chord-view/chord-view-item/chord-view-item.component';
import { DeleteConfirmationComponent } from './components/service/service-item//delete-confirmation/delete-confirmation.component';
import { DisplayModeSelectorComponent } from './components/display-mode-selector/display-mode-selector.component';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { Nl2BrPipe } from './pipes/nl2br.pipe';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RoutingModule } from './routing.module';
import { SearchComponent } from './components/search/search.component';
import { SearchOptionsComponent } from './components/search/search-options/search-options.component';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { ServiceComponent } from './components/service/service.component';
import { ServiceItemComponent } from './components/service/service-item/service-item.component';
import { ServiceListComponent } from './components/service/service-list/service-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlideItemComponent } from './components/slides/slide-item/slide-item.component';
import { SlideListComponent } from './components/slides/slide-list/slide-list.component';
import { SlidesComponent } from './components/slides/slides.component';
import { StageChordPreviewComponent } from './components/settings/stage-chord-preview/stage-chord-preview.component';
import { StageViewComponent } from './components/stage-view/stage-view.component';
import { StageViewItemComponent } from './components/stage-view/stage-view-item/stage-view-item.component';
import { ThemesComponent } from './components/themes/themes.component';
import { TranslationService } from './services/translation.service';

@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    ChordProPipe,
    ChordViewComponent,
    ChordViewItemComponent,
    DeleteConfirmationComponent,
    DisplayModeSelectorComponent,
    LoginComponent,
    MainViewComponent,
    Nl2BrPipe,
    PageNotFoundComponent,
    SearchComponent,
    SearchOptionsComponent,
    SentenceCasePipe,
    ServiceComponent,
    ServiceItemComponent,
    ServiceListComponent,
    SettingsComponent,
    SlideItemComponent,
    SlideListComponent,
    SlidesComponent,
    StageChordPreviewComponent,
    StageViewComponent,
    StageViewItemComponent,
    ThemesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatBottomSheetModule,
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
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationService
      }
    })
  ],
  providers: [
    SentenceCasePipe,
    Title,
    TitleCasePipe,
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
