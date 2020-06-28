import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-http-status-badge',
  templateUrl: './http-status-badge.component.html',
  styles: [],
})
export class HttpStatusBadgeComponent {
  @Input() status: number;

  get colors() {
    return {
      'bg-green-600': this.isSuccess(),
      'bg-purple-600': this.isFailure(),
      'bg-gray-600': this.isNeutral(),
    };
  }

  constructor() {}

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  }

  isFailure() {
    return this.status >= 400 || this.status < 100;
  }

  isNeutral() {
    return this.status >= 300 && this.status < 400;
  }
}
