import { TestBed } from '@angular/core/testing';

import { ExecutionService } from './execution.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExecutionService', () => {
  let service: ExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
