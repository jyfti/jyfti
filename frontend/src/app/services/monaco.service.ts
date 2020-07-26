import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { filter, map, first, tap } from 'rxjs/operators';
import dataflowSchema from '../../assets/dataflow-schema.json';

@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  monacoPromise: Promise<any> = null;

  constructor() {}

  get monaco(): Observable<any> {
    return interval(100).pipe(
      map(() => (<any>window).monaco),
      filter((monaco) => typeof monaco === 'object'),
      first(),
      tap((monaco) => this.onMonacoLoad(monaco))
    );
  }

  onMonacoLoad(monaco) {
    console.log(dataflowSchema);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'internal://server/dataflow-schema.json',
          fileMatch: ['dataflow.json'],
          schema: dataflowSchema,
        },
      ],
    });
  }
}
