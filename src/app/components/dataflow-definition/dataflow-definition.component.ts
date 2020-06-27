import { Component, OnInit } from '@angular/core';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    apiCalls: this.fb.array([
      this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      }),
    ]),
  });

  get apiCalls() {
    return this.formGroup.get('apiCalls') as FormArray;
  }

  constructor(
    private dataFlowExecutionService: DataFlowExecutionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  execute() {
    this.dataFlowExecutionService
      .execute(this.formGroup.value['apiCalls'])
      .subscribe();
  }

  addApiCall() {
    this.apiCalls.push(
      this.fb.group({
        method: ['GET'],
        url: ['http://swapi.dev/api/planets/1/'],
      })
    );
  }
}
