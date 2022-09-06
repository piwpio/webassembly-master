import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashViewComponent } from './features/splash-view/splash-view.component';

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
    path: '3dtest',
    loadChildren: () => import('./features/edtest/edtest.module').then((m) => m.EdtestModule),
  },
  {
    path: 'image',
    loadChildren: () => import('./features/image/image.module').then((m) => m.ImageModule),
  },
  {
    path: 'sort',
    loadChildren: () => import('./features/sort/sort.module').then((m) => m.SortModule),
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
