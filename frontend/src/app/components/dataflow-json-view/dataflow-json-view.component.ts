import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { combineLatest, Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { MonacoService } from 'src/app/services/monaco.service';

@Component({
  selector: 'app-dataflow-json-view',
  templateUrl: './dataflow-json-view.component.html',
  styles: [],
})
export class DataflowJsonViewComponent implements OnInit {
  model$: Observable<NgxEditorModel>;

  constructor(
    private store: Store<GlobalState>,
    private monacoService: MonacoService
  ) {}

  ngOnInit() {
    const dataflow$ = this.store.pipe(select('dataflow', 'dataflow'));
    const uri$ = this.monacoService.monaco.pipe(
      map((monaco) => monaco.Uri.parse('internal://server/dataflow.json'))
    );
    this.model$ = combineLatest(dataflow$, uri$).pipe(
      map(([dataflow, uri]) => ({
        value: JSON.stringify(dataflow, null, 2),
        language: 'json',
        uri,
      }))
    );
  }
}
