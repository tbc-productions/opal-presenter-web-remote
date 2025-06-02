import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertComponent } from './components/alert/alert.component';
import { ChordViewComponent } from './components/chord-view/chord-view.component';
import { LowerThirdComponent } from './components/lower-third/lower-third.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SearchComponent } from './components/search/search.component';
import { ServiceComponent } from './components/service/service.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SlidesComponent } from './components/slides/slides.component';
import { StageViewComponent } from './components/stage-view/stage-view.component';
import { ThemesComponent } from './components/themes/themes.component';

const routes: Routes = [
    { path: '', redirectTo: '/service', pathMatch: 'full' },
    { path: 'service', component: ServiceComponent },
    { path: 'slides', component: SlidesComponent },
    { path: 'alerts', component: AlertComponent },
    { path: 'search', component: SearchComponent },
    { path: 'chords', component: ChordViewComponent },
    { path: 'main', component: MainViewComponent },
    { path: 'stage', component: StageViewComponent },
    { path: 'themes', component: ThemesComponent },
    { path: 'lower-third', component: LowerThirdComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: PageNotFoundComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
