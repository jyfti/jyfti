import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { Observable } from 'rxjs';
import { DataflowPreview } from 'src/app/types/dataflow-preview.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataflow-selection',
  templateUrl: './dataflow-selection.component.html',
  styles: [],
})
export class DataflowSelectionComponent implements OnInit {
  dataflowPreviews$: Observable<DataflowPreview[]>;

  constructor(private store: Store<GlobalState>, private router: Router) {}

  ngOnInit() {
    this.dataflowPreviews$ = this.store.pipe(
      select('dataflow', 'dataflowPreviews')
    );
  }

  navigateToDataflow(id: string) {
    this.router.navigate(['/dataflow', id]);
  }
}
