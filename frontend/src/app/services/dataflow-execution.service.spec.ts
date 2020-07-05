import { TestBed } from '@angular/core/testing';

import { DataflowExecutionService } from './dataflow-execution.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataflowExecutionService', () => {
  let service: DataflowExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataflowExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
