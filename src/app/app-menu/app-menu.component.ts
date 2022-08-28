import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
})
export class AppMenuComponent {
  @Output() backClick: EventEmitter<any> = new EventEmitter<any>();

  onBackClick(): void {
    this.backClick.emit();
  }
}
