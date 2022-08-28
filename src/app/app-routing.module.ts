import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashViewComponent } from './splash-view/splash-view.component';

const routes: Routes = [
  {
    path: '',
    component: SplashViewComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
