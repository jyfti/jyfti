import { TestBed } from '@angular/core/testing';

import { DataflowFormService } from './dataflow-form.service';

describe('DataflowFormService', () => {
  let service: DataflowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataflowFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
