import { HttpRequestTemplate } from "./http-request-template.type";

export type JsonExpression = unknown;

export interface ForLoop {
  const: string;
  in: JsonExpression;
  do: Step[];
  return: string;
}

export interface RequestStep {
  name?: JsonExpression;
  assignTo: string;
  request: HttpRequestTemplate;
}

export interface ExpressionStep {
  name?: JsonExpression;
  assignTo: string;
  expression: JsonExpression;
}

export interface ShellStep {
  name?: JsonExpression;
  assignTo: string;
  shell: JsonExpression;
}

export interface ForStep {
  name?: JsonExpression;
  assignTo: string;
  for: ForLoop;
}

export type Step = RequestStep | ExpressionStep | ShellStep | ForStep;

export function isRequestStep(step: Step): step is RequestStep {
  return "request" in step;
}

export function isExpressionStep(step: Step): step is ExpressionStep {
  return "expression" in step;
}

export function isShellStep(step: Step): step is ShellStep {
  return "shell" in step;
}

export function isForStep(step: Step): step is ForStep {
  return "for" in step;
}
