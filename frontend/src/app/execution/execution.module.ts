import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { executionReducer } from './execution.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ExecutionEffects } from './execution.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('execution', executionReducer),
    EffectsModule.forFeature([ExecutionEffects]),
  ],
})
export class ExecutionModule {}
