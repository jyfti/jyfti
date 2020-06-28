import { TestBed } from '@angular/core/testing';

import { DataFlowFormService } from './data-flow-form.service';

describe('DataFlowFormService', () => {
  let service: DataFlowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFlowFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
