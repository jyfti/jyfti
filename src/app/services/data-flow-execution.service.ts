import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(url: string): Observable<any> {
    return this.http.get(url);
  }
}
