import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DataflowDefinitionComponent } from './components/dataflow-definition/dataflow-definition.component';
import { HttpRequestComponent } from './components/http-request/http-request.component';

import { reducer } from './ngrx/dataflow.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DataFlowExecutionEffects } from './ngrx/effects/dataflow-execution.effects';
import { StepComponent } from './components/step/step.component';

@NgModule({
  declarations: [
    AppComponent,
    DataflowDefinitionComponent,
    HttpRequestComponent,
    StepComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ dataflow: reducer }),
    EffectsModule.forRoot([DataFlowExecutionEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
