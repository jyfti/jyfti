import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-api-call',
  templateUrl: './api-call.component.html',
})
export class ApiCallComponent implements OnInit {
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
