import { of } from "rxjs";
import { HttpRequest } from "../../types";
import { Observable } from "rxjs";

export function http(
  request: HttpRequest<unknown>
): Observable<{ request: HttpRequest<unknown>; body: unknown }> {
  return of({ request, body: of({ field: "value" }) });
}
