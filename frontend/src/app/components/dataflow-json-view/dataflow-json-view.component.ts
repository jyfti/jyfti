import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Observable } from 'rxjs';
import { Dataflow } from 'src/app/types/dataflow.type';

@Component({
  selector: 'app-dataflow-json-view',
  templateUrl: './dataflow-json-view.component.html',
  styles: [],
})
export class DataflowJsonViewComponent implements OnInit {
  dataflow$: Observable<Dataflow>;

  constructor(private store: Store<GlobalState>) {}

  ngOnInit() {
    this.dataflow$ = this.store.pipe(select('dataflow', 'dataflow'));
  }
}
