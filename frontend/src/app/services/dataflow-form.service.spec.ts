import { TestBed } from '@angular/core/testing';

import { DataflowFormService } from './dataflow-form.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('DataflowFormService', () => {
  let service: DataflowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });
    service = TestBed.inject(DataflowFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
