import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
})
export class HttpRequestComponent implements OnInit {
  @Input() formGroup: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
