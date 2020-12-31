import { JsonExpression } from "./step.type";

export interface HttpRequestTemplate {
  method: JsonExpression;
  url: JsonExpression;
  body?: JsonExpression;
  headers?: JsonExpression;
  writeTo?: JsonExpression;
}
