import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpRequestDetailComponent } from './components/http-request-detail/http-request-detail.component';
import { DataflowDefinitionComponent } from './components/dataflow-definition/dataflow-definition.component';
import { HttpRequestDetailPageComponent } from './components/http-request-detail-page/http-request-detail-page.component';

const routes: Routes = [
  { path: '', component: DataflowDefinitionComponent },
  { path: 'step/:index', component: HttpRequestDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
