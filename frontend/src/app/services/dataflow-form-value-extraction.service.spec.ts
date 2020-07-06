import { TestBed } from '@angular/core/testing';

import { DataflowFormValueExtractionService } from './dataflow-form-value-extraction.service';

describe('DataflowFormValueExtractionService', () => {
  let service: DataflowFormValueExtractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataflowFormValueExtractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
