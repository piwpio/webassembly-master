import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashViewComponent } from '@features/splash-view/splash-view.component';

const routes: Routes = [
  {
    path: '',
    component: SplashViewComponent,
  },
  // {
  //   path: 'fib',
  //   loadChildren: () => import('./features/fibonacci/fibonacci.module').then((m) => m.FibonacciModule),
  // },
  // {
  //   path: '3dtest',
  //   loadChildren: () => import('./features/edtest/edtest.module').then((m) => m.EdtestModule),
  // },
  // {
  //   path: 'image',
  //   loadChildren: () => import('./features/image/image.module').then((m) => m.ImageModule),
  // },
  // {
  //   path: 'sort',
  //   loadChildren: () => import('./features/sort/sort.module').then((m) => m.SortModule),
  // },
  // {
  //   path: 'server-sort',
  //   loadChildren: () => import('./features/server-sort/server-sort.module').then((m) => m.ServerSortModule),
  // },
  // {
  //   path: 'server-matrix-det',
  //   loadChildren: () =>
  //     import('./features/server-matrix-det/server-matrix-det.module').then((m) => m.ServerMatrixDetModule),
  // },
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
