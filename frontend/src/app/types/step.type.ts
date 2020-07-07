import { HttpRequestTemplate } from './http-request-template.type';

export type JsonExpression = any;

export interface ForLoop {
  const: string,
  in: JsonExpression,
  do: Step[],
  return: JsonExpression,
}

export type Step = HttpRequestStep;

export interface HttpRequestStep {
  assignTo: string;
  request?: HttpRequestTemplate;
  expression?: JsonExpression;
  for?: ForLoop;
}
