import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
})
export class StepComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() evaluation: any;

  constructor() {}

  ngOnInit(): void {}
}
