import { Component, OnInit } from '@angular/core';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html',
})
export class DataflowDefinitionComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    method: ['GET'],
    url: ['http://swapi.dev/api/planets/1/'],
  });

  constructor(
    private dataFlowExecutionService: DataFlowExecutionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  execute() {
    this.dataFlowExecutionService
      .execute(this.formGroup.controls.url.value)
      .subscribe();
  }
}
