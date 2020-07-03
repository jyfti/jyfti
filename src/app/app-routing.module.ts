import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpRequestDetailPageComponent } from './components/http-request-detail-page/http-request-detail-page.component';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { DataflowPageComponent } from './components/dataflow-page/dataflow-page.component';

const routes: Routes = [
  { path: '', component: DataflowSelectionComponent },
  { path: 'dataflow/:id', component: DataflowPageComponent },
  { path: 'dataflow/:id/step/:index', component: HttpRequestDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
