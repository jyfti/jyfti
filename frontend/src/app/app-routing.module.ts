import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { DataflowDefinitionComponent } from './components/dataflow-definition/dataflow-definition.component';
import { HttpRequestDetailComponent } from './components/http-request-detail/http-request-detail.component';
import { ExecutionLogComponent } from './components/execution-log/execution-log.component';

const routes: Routes = [
  { path: '', component: DataflowSelectionComponent },
  { path: 'dataflow/:id', component: DataflowDefinitionComponent },
  {
    path: 'dataflow/:id/step/:index',
    component: HttpRequestDetailComponent,
  },
  { path: 'dataflow/:id/execution', component: ExecutionLogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
