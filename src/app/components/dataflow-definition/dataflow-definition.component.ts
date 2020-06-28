import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { resetExecution, startExecution } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { DataFlow } from 'src/app/types/data-flow.type';
import { HttpRequestTemplate } from 'src/app/types/http-request-template.type';
import { Step } from 'src/app/types/step.type';
import planets from 'src/assets/dataflows/planets.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup = this.createDataFlow(planets);

  get steps() {
    return this.formGroup.get('steps') as FormArray;
  }

  execution$: Observable<any>;
  evaluations$: Observable<any>;

  constructor(private store: Store<GlobalState>, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.execution$ = this.store.pipe(select('dataflow', 'execution'));
    this.evaluations$ = this.execution$.pipe(
      map((execution) => execution?.evaluations || {})
    );
  }

  execute() {
    const steps = this.formGroup.value['steps'];
    this.store.dispatch(startExecution({ steps }));
  }

  clearExecution() {
    this.store.dispatch(resetExecution());
  }

  editStep(stepIndex: number) {
    this.router.navigate(['/step', stepIndex]);
  }

  removeStep(stepIndex: number) {
    this.steps.removeAt(stepIndex);
  }

  addStep() {
    this.steps.push(
      this.createStep({
        assignTo: 'my_variable',
        httpRequestTemplate: {
          method: 'GET',
          url: 'http://swapi.dev/api/planets/1/',
        },
      })
    );
  }

  createDataFlow(dataflow: DataFlow): FormGroup {
    return this.fb.group({
      steps: this.createSteps(dataflow.steps),
    });
  }

  createSteps(steps: Step[]): FormArray {
    return this.fb.array(steps.map((step) => this.createStep(step)));
  }

  createStep(step: Step): FormGroup {
    return this.fb.group({
      assignTo: [step.assignTo],
      httpRequestTemplate: this.createHttpRequestTemplate(
        step.httpRequestTemplate
      ),
    });
  }

  createHttpRequestTemplate(
    httpRequestTemplate: HttpRequestTemplate
  ): FormGroup {
    return this.fb.group({
      method: [httpRequestTemplate.method],
      url: [httpRequestTemplate.url],
    });
  }
}
