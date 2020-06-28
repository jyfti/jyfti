import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpRequestStep } from 'src/app/types/step.type';
import { DataFlowFormService } from 'src/app/services/data-flow-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-http-request-detail',
  templateUrl: './http-request-detail.component.html',
  styles: [],
})
export class HttpRequestDetailComponent implements OnChanges {
  @Input() stepIndex: number;
  @Input() step: HttpRequestStep;

  formGroup: FormGroup;

  constructor(private dataflowFormService: DataFlowFormService) {}

  ngOnChanges() {
    if (this.step?.httpRequestTemplate) {
      this.formGroup = this.dataflowFormService.createHttpRequestTemplate(
        this.step?.httpRequestTemplate
      );
    }
  }
}
