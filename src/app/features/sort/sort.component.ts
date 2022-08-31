import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('A');
  }
}
