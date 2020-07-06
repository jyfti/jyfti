import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-json-e-evaluation',
  templateUrl: './json-e-evaluation.component.html',
  styles: [
  ]
})
export class JsonEEvaluationComponent implements OnInit {
  @Input() formControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
