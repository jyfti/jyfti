import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-http-status-badge',
  templateUrl: './http-status-badge.component.html',
  styles: [],
})
export class HttpStatusBadgeComponent implements OnInit {
  @Input() status: number;

  constructor() {}

  ngOnInit(): void {}
}
