import { TestBed } from '@angular/core/testing';

import { DataFlowExecutionService } from './data-flow-execution.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataFlowExecutionService', () => {
  let service: DataFlowExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataFlowExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
