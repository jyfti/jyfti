import { HttpRequestTemplate } from './http-request-template.type';

export type JsonExpression = any;

export interface ForLoop {
  const: string,
  in: JsonExpression,
  do: Step[],
  return: JsonExpression,
}

export interface Step {
  assignTo: string;
  request?: HttpRequestTemplate;
  expression?: JsonExpression;
  for?: ForLoop;
}
