import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { DataflowUiViewComponent } from './components/dataflow-ui-view/dataflow-ui-view.component';
import { HttpRequestDetailComponent } from './components/http-request-detail/http-request-detail.component';
import { ExecutionLogComponent } from './components/execution-log/execution-log.component';
import { DataflowJsonViewComponent } from './components/dataflow-json-view/dataflow-json-view.component';

const routes: Routes = [
  { path: '', component: DataflowSelectionComponent },
  { path: 'dataflow/:id', component: DataflowUiViewComponent },
  {
    path: 'dataflow/:id/step/:index',
    component: HttpRequestDetailComponent,
  },
  { path: 'dataflow/:id/json', component: DataflowJsonViewComponent },
  { path: 'dataflow/:id/execution', component: ExecutionLogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
