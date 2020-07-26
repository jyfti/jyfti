import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { startExecution } from 'src/app/ngrx/dataflow-execution.actions';
import { loadedDataflow, persistDataflow } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataflowFormValueExtractionService } from 'src/app/services/dataflow-form-value-extraction.service';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';

@Component({
  selector: 'app-dataflow-ui-view',
  templateUrl: './dataflow-ui-view.component.html',
})
export class DataflowUiViewComponent implements OnInit {
  formGroup$: Observable<FormGroup>;

  constructor(
    private store: Store<GlobalState>,
    private dataflowFormService: DataflowFormService,
    private dataflowFormValueExtractionService: DataflowFormValueExtractionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formGroup$ = this.store.pipe(
      select('dataflow', 'dataflow'),
      map((dataflow) => this.dataflowFormService.createDataFlow(dataflow))
    );
  }

  editStep(formGroup: FormGroup, stepIndex: number) {
    this.store.dispatch(
      loadedDataflow({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
    this.router.navigate(['step', stepIndex], { relativeTo: this.route });
  }

  execute(formGroup: FormGroup) {
    this.store.dispatch(
      startExecution({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
    this.router.navigate(['execution'], { relativeTo: this.route });
  }

  persist(formGroup: FormGroup) {
    this.store.dispatch(
      persistDataflow({
        dataflow: this.dataflowFormValueExtractionService.extractDataFlow(
          formGroup.value
        ),
      })
    );
  }

  viewJson() {
    this.router.navigate(['json'], { relativeTo: this.route });
  }
}
