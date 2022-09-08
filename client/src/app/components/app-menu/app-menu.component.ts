import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

interface AppMenu {
  label: string;
  url: string;
}

const ROUTES: AppMenu[] = [
  { label: 'Fibonacci', url: '/fib' },
  { label: '3D cube', url: '/3dtest' },
  { label: 'Image processing', url: '/image' },
  { label: 'Array sorting', url: '/sort' },
  { label: 'Server array sorting', url: '/server-sort' },
];

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
})
export class AppMenuComponent {
  @Input() drawer: MatDrawer;
  @Output() backClick: EventEmitter<any> = new EventEmitter<any>();

  readonly routes: AppMenu[] = ROUTES;

  constructor(private readonly router: Router) {}

  onBackClick(): void {
    this.backClick.emit();
  }

  navigateTo(routeUrl: string): void {
    this.router.navigateByUrl(routeUrl).then(() => {
      this.drawer.close().then();
    });
  }
}
