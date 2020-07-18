import { TestBed } from '@angular/core/testing';

import { ExecutionNewService } from './execution-new.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExecutionNewService', () => {
  let service: ExecutionNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExecutionNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
