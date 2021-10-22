import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToxicRoutes } from './shared/shared.module';
import { TranslationComponent } from './translate/translation/translation.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  {
    path: ToxicRoutes.home,
    component: HomeComponent,
  },
  {
    path: ToxicRoutes.translate,
    component: TranslationComponent,
  },
  {
    path: ToxicRoutes.tutorial,
    component: TutorialComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
