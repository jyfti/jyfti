import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpRequestDetailPageComponent } from './components/http-request-detail-page/http-request-detail-page.component';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { DataflowDefinitionComponent } from './components/dataflow-definition/dataflow-definition.component';

const routes: Routes = [
  { path: '', component: DataflowSelectionComponent },
  { path: 'dataflow/:id', component: DataflowDefinitionComponent },
  {
    path: 'dataflow/:id/step/:index',
    component: HttpRequestDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
