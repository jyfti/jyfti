import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
})
export class HttpRequestComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() evaluation: HttpResponse<any>;

  constructor() {}

  ngOnInit(): void {}
}
