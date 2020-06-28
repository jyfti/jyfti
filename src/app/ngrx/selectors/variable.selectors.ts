import { DataFlowState } from '../dataflow.state';

import { flow, reduce, map } from 'lodash/fp';
import { Step } from 'src/app/types/step.type';

const indexedMap = map.convert({ cap: false });

export const selectVariables = (state: DataFlowState): { [id: string]: any } =>
  flow(
    indexedMap((step: Step, stepIndex: number) => ({
      [step.assignTo]: state.execution.evaluations[stepIndex],
    })),
    reduce((variableMap, variable) => ({ ...variableMap, ...variable }), {})
  )(state.steps);
