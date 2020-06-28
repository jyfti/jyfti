import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
})
export class StepComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() evaluation: any;
  @Input() stepIndex: number;

  @Output() removed = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
