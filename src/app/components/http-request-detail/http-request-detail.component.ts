import { Component, OnInit, Input } from '@angular/core';
import { HttpRequestStep } from 'src/app/types/step.type';

@Component({
  selector: 'app-http-request-detail',
  templateUrl: './http-request-detail.component.html',
  styles: [],
})
export class HttpRequestDetailComponent implements OnInit {
  @Input() stepIndex: number;
  @Input() step: HttpRequestStep;

  constructor() {}

  ngOnInit(): void {}
}
