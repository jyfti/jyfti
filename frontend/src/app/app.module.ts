import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DataflowUiViewComponent } from './components/dataflow-ui-view/dataflow-ui-view.component';
import { DataflowSelectionComponent } from './components/dataflow-selection/dataflow-selection.component';
import { HttpRequestDetailComponent } from './components/http-request-detail/http-request-detail.component';
import { HttpRequestComponent } from './components/http-request/http-request.component';
import { HttpStatusBadgeComponent } from './components/http-status-badge/http-status-badge.component';
import { StepComponent } from './components/step/step.component';
import { DataflowRouterEffects } from './ngrx/effects/dataflow-router.effects';
import { dataflowReducer } from './ngrx/dataflow.reducer';
import { ExecutionModule } from './execution/execution.module';
import { DataflowPersistenceEffects } from './ngrx/effects/dataflow-persistence.effects';
import { JsonEEvaluationComponent } from './components/json-e-evaluation/json-e-evaluation.component';
import { ForLoopComponent } from './components/for-loop/for-loop.component';
import { StepsComponent } from './components/steps/steps.component';
import { ExecutionLogComponent } from './components/execution-log/execution-log.component';
import { DataflowJsonViewComponent } from './components/dataflow-json-view/dataflow-json-view.component';

const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: { scrollBeyondLastLine: false },
};

@NgModule({
  declarations: [
    AppComponent,
    DataflowUiViewComponent,
    HttpRequestComponent,
    StepComponent,
    HttpStatusBadgeComponent,
    HttpRequestDetailComponent,
    DataflowSelectionComponent,
    JsonEEvaluationComponent,
    ForLoopComponent,
    StepsComponent,
    ExecutionLogComponent,
    DataflowJsonViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ dataflow: dataflowReducer, router: routerReducer }),
    EffectsModule.forRoot([DataflowRouterEffects, DataflowPersistenceEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    StoreRouterConnectingModule.forRoot(),
    MonacoEditorModule.forRoot(monacoConfig),
    ExecutionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
