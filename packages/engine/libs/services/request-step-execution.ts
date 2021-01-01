import { http } from "./http";
import * as fs from "fs";
import * as nodePath from "path";
import { of, from, Observable } from "rxjs";
import { map, mergeMap, mapTo } from "rxjs/operators";
import { evaluate } from "./evaluation";
import {
  Evaluation,
  HttpMethod,
  HttpRequest,
  HttpRequestTemplate,
  VariableMap,
  Headers,
} from "../types";

export function executeRequestStep(
  request: HttpRequestTemplate,
  variables: VariableMap,
  outRoot: string
): Observable<Evaluation> {
  return of({}).pipe(
    map(() => createHttpRequest(request, variables)),
    mergeMap((request) =>
      http(request).pipe(
        map((response) => ({ response, writeTo: request.writeTo }))
      )
    ),
    mergeMap(({ response, writeTo }) =>
      response.body.pipe(
        mergeMap((body) => processBody(body, writeTo, outRoot)),
        map((body) => ({ ...response, body }))
      )
    )
  );
}

function processBody(
  body: Buffer,
  fileName: string | undefined,
  outRoot: string
): Observable<unknown> {
  return fileName
    ? from(
        fs.promises.writeFile(nodePath.resolve(outRoot, fileName), body, "utf8")
      ).pipe(mapTo("Written to " + fileName))
    : of(parseJsonOrString(body));
}

function parseJsonOrString(buffer: Buffer): unknown {
  // TODO Look at response header for content type
  const str = buffer.toString("utf8");
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function createHttpRequest(
  template: HttpRequestTemplate,
  variables: VariableMap
): HttpRequest<unknown> {
  const url = evaluate(variables, template.url);
  if (!isString(url)) {
    throw new Error("The url needs to evaluate to a string.");
  }
  const writeTo = evaluate(variables, template.writeTo);
  if (!isWriteTo(writeTo)) {
    throw new Error("The field 'writeTo' needs to evaluate to a string.");
  }
  const headers = evaluate(variables, template.headers);
  if (!isHeaders(headers)) {
    throw new Error(
      "The headers need to evaluate to an object mapping header names to strings."
    );
  }
  return {
    url,
    method: evaluate(variables, template.method) as HttpMethod,
    body: evaluate(variables, template.body),
    headers,
    writeTo,
  };
}

function isWriteTo(object: unknown): object is string | undefined {
  return !object || isString(object);
}

function isString(object: unknown): object is string {
  return typeof object === "string";
}

function isHeaders(object: unknown): object is Headers {
  // TODO Improve check
  return typeof object === "object";
}
