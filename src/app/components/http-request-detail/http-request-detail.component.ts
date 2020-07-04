import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { saveStep } from 'src/app/ngrx/dataflow.actions';
import { GlobalState } from 'src/app/ngrx/dataflow.state';
import { selectStep } from 'src/app/ngrx/selectors/dataflow.selectors';
import { DataflowFormService } from 'src/app/services/dataflow-form.service';

@Component({
  selector: 'app-http-request-detail',
  templateUrl: './http-request-detail.component.html',
  styles: [],
})
export class HttpRequestDetailComponent implements OnInit {
  formGroup$: Observable<FormGroup>;

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private route: ActivatedRoute,
    private dataflowFormService: DataflowFormService
  ) {}

  ngOnInit() {
    this.formGroup$ = this.store.pipe(
      select(selectStep),
      filter(step => !!step),
      map((step) => this.dataflowFormService.createStep(step))
    );
  }

  save(formGroup: FormGroup) {
    this.store.dispatch(
      saveStep({
        step: formGroup.value,
      })
    );
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
