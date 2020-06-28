import { HttpRequestTemplate } from './http-request-template.type';

export interface Step {
  assignTo: string;
  httpRequestTemplate: HttpRequestTemplate;
}
