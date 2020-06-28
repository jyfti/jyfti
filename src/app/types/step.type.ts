import { HttpRequestTemplate } from './http-request-template.type';

export interface HttpRequestStep {
  assignTo: string;
  httpRequestTemplate: HttpRequestTemplate;
}
