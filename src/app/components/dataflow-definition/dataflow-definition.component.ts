import { Component, OnInit } from '@angular/core';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';

@Component({
  selector: 'app-dataflow-definition',
  templateUrl: './dataflow-definition.component.html'
})
export class DataflowDefinitionComponent implements OnInit {
  constructor(private dataFlowExecutionService: DataFlowExecutionService) {}

  ngOnInit(): void {}

  execute() {
    this.dataFlowExecutionService.execute(
      'http://swapi.dev/api/planets/1/'
    ).subscribe();
  }
}
