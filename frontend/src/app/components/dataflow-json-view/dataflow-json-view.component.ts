import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { MonacoService } from 'src/app/services/monaco.service';
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
