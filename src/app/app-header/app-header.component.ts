import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Output() menuClick: EventEmitter<any> = new EventEmitter<any>();

  onMenuClick(): void {
    this.menuClick.emit();
  }
}
