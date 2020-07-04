import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { saveStep } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';
import { HttpRequestStep } from 'src/app/types/step.type';

@Component({
  selector: 'app-http-request-detail',
  templateUrl: './http-request-detail.component.html',
  styles: [],
})
export class HttpRequestDetailComponent implements OnChanges {
  @Input() stepIndex: number;
  @Input() step: HttpRequestStep;

  formGroup: FormGroup;

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private route: ActivatedRoute,
    private dataflowFormService: DataflowFormService
  ) {}

  ngOnChanges() {
    if (this.step?.request) {
      this.formGroup = this.dataflowFormService.createHttpRequestTemplate(
        this.step?.request
      );
    }
  }

  save() {
    this.store.dispatch(
      saveStep({
        stepIndex: this.stepIndex,
        step: { ...this.step, request: this.formGroup.value },
      })
    );
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
