import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evaluation } from './execution.service';
import { Dataflow } from '../types/dataflow.type';

interface ExecutionScope {
  stepIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionEngineService {
  constructor() {}

  executeNext(
    dataflow: Dataflow,
    scope: ExecutionScope
  ): Observable<Evaluation> {
    return of();
  }
}
