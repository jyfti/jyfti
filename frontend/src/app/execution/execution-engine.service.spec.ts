import { TestBed } from '@angular/core/testing';

import { ExecutionEngineService } from './execution-engine.service';

describe('ExecutionEngineService', () => {
  let service: ExecutionEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
