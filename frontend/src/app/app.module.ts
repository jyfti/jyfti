import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DataflowDefinitionComponent } from './components/dataflow-definition/dataflow-definition.component';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { HttpRequestDetailComponent } from './components/http-request-detail/http-request-detail.component';
import { HttpRequestComponent } from './components/http-request/http-request.component';
import { HttpStatusBadgeComponent } from './components/http-status-badge/http-status-badge.component';
import { StepComponent } from './components/step/step.component';
import { DataflowRouterEffects } from './ngrx/effects/dataflow-router.effects';
import { dataflowReducer } from './ngrx/dataflow.reducer';
import { ExecutionModule } from './execution/execution.module';

@NgModule({
  declarations: [
    AppComponent,
    DataflowDefinitionComponent,
    HttpRequestComponent,
    StepComponent,
    HttpStatusBadgeComponent,
    HttpRequestDetailComponent,
    DataflowSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ dataflow: dataflowReducer, router: routerReducer }),
    EffectsModule.forRoot([DataflowRouterEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    StoreRouterConnectingModule.forRoot(),
    MonacoEditorModule.forRoot(),
    ExecutionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
