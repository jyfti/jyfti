import { HttpRequestTemplate } from "./http-request-template.type";

export type JsonExpression = unknown;

export interface ForLoop {
  const: string;
  in: JsonExpression;
  do: Step[];
  return: string;
}

export interface RequestStep {
  assignTo: string;
  request: HttpRequestTemplate;
}

export interface ExpressionStep {
  assignTo: string;
  expression: JsonExpression;
}

export interface ForStep {
  assignTo: string;
  for: ForLoop;
}

export type Step = RequestStep | ExpressionStep | ForStep;

export function isRequestStep(step: Step): step is RequestStep {
  return "request" in step;
}

export function isExpressionStep(step: Step): step is ExpressionStep {
  return "expression" in step;
}

export function isForStep(step: Step): step is ForStep {
  return "for" in step;
}
