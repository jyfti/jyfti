import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NgxEditorModel } from 'ngx-monaco-editor';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { MonacoService } from 'src/app/services/monaco.service';
import { combineLatest, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Dataflow } from 'src/app/types/dataflow.type';

@Component({
  selector: 'app-dataflow-json-view',
  templateUrl: './dataflow-json-view.component.html',
  styles: [],
})
export class DataflowJsonViewComponent implements OnInit {
  dataflow$: Observable<Dataflow>;
  uri$: Observable<any>;

  constructor(
    private store: Store<GlobalState>,
    private monacoService: MonacoService
  ) {}

  ngOnInit() {
    this.dataflow$ = this.store.pipe(select('dataflow', 'dataflow'));
    this.uri$ = this.monacoService.monaco.pipe(
      map((monaco) => monaco.Uri.parse('internal://server/dataflow.json'))
    );
  }
}
