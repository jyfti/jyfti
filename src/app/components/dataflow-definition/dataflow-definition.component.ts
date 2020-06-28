import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Store, select } from '@ngrx/store';
import { startExecution } from 'src/app/ngrx/dataflow.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const createHttpRequest = (json) => new HttpRequest(json.method, json.url);

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    steps: this.fb.array([this.createStep()]),
  });

  get steps() {
    return this.formGroup.get('steps') as FormArray;
  }

  evaluations$: Observable<any>;

  constructor(private store: Store<GlobalState>, private fb: FormBuilder) {}

  ngOnInit() {
    this.evaluations$ = this.store.pipe(
      select('dataflow', 'execution'),
      map((execution) => execution?.evaluations || {})
    );
  }

  execute() {
    const steps = this.formGroup.value['steps'].map((step) => ({
      ...step,
      httpRequest: createHttpRequest(step.httpRequest),
    }));
    this.store.dispatch(startExecution({ steps }));
  }

  addStep() {
    this.steps.push(this.createStep());
  }

  createStep() {
    return this.fb.group({
      assignTo: ['my_variable'],
      httpRequest: this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      }),
    });
  }
}
