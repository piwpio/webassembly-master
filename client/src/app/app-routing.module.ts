import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashViewComponent } from '@features/splash-view/splash-view.component';

const routes: Routes = [
  {
    path: '',
    component: SplashViewComponent,
  },
  {
    path: 'test',
    loadChildren: () =>
      import('./features/server-calculations/server-calculations.module').then((m) => m.ServerCalculationsModule),
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
