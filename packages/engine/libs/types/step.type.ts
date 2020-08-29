import { HttpRequestTemplate } from "./http-request-template.type";

export type JsonExpression = any;

export interface ForLoop {
  const: string;
  in: JsonExpression;
  do: Step[];
  return: JsonExpression;
}

export interface Step {
  assignTo: string;
}

export interface RequestStep extends Step {
  request: HttpRequestTemplate;
}

export interface ExpressionStep extends Step {
  expression: JsonExpression;
}

export interface ForStep extends Step {
  for: ForLoop;
}

export function isRequestStep(step: Step): step is RequestStep {
  return "request" in step;
}

export function isExpressionStep(step: Step): step is ExpressionStep {
  return "expression" in step;
}

export function isForStep(step: Step): step is ForStep {
  return "for" in step;
}
