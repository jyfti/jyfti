import { HttpRequestTemplate } from './http-request-template.type';

export type Step = HttpRequestStep;

export interface HttpRequestStep {
  assignTo: string;
  httpRequestTemplate: HttpRequestTemplate;
}
