import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
})
export class HttpRequestComponent implements OnInit {
  @Input() formGroup: FormGroup;

  readonly httpMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  constructor() {}

  ngOnInit(): void {}
}
