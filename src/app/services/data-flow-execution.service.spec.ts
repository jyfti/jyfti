import { TestBed } from '@angular/core/testing';

import { DataFlowExecutionService } from './data-flow-execution.service';

describe('DataFlowExecutionService', () => {
  let service: DataFlowExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFlowExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
