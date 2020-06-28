import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Store } from '@ngrx/store';
import { startExecution } from 'src/app/ngrx/dataflow.actions';

const createHttpRequest = (json) => new HttpRequest(json.method, json.url);

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent {
  formGroup: FormGroup = this.fb.group({
    steps: this.fb.array([this.createStep()]),
  });

  get steps() {
    return this.formGroup.get('steps') as FormArray;
  }

  constructor(private store: Store<GlobalState>, private fb: FormBuilder) {}

  execute() {
    const httpRequests = this.formGroup.value['steps']
      .map((step) => step.httpRequest)
      .map(createHttpRequest);
    this.store.dispatch(startExecution({ httpRequests }));
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
