import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashViewComponent } from '@features/splash-view/splash-view.component';

const routes: Routes = [
  {
    path: '',
    component: SplashViewComponent,
  },
  {
    path: 'fib',
    loadChildren: () => import('./features/fibonacci/fibonacci.module').then((m) => m.FibonacciModule),
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
