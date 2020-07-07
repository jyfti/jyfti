import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-for-loop',
  templateUrl: './for-loop.component.html',
  styles: [
  ]
})
export class ForLoopComponent implements OnInit {
  @Input() formGroup: FormGroup;

  constructor() { }

  ngOnInit() {

  }

}
