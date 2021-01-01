import { defer, Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Evaluation, JsonExpression, VariableMap } from "../types";
import { evaluate } from "./evaluation";
import { exec } from "child_process";

export function executeShellStep(
  expression: JsonExpression,
  variables: VariableMap,
  outRoot: string
): Observable<Evaluation> {
  return of(expression).pipe(
    mergeMap((expression) => {
      const command = evaluate(variables, expression);
      if (!isString(command)) {
        throw new Error("The command needs to evaluate to a string.");
      }
      return defer(() => execCommand(command, outRoot));
    })
  );
}

function execCommand(command: string, cwd: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function isString(object: unknown): object is string {
  return typeof object === "string";
}
