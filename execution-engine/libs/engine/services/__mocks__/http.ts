import { of } from "rxjs";
import { HttpRequest } from "../../types";

export function http(request: HttpRequest<any>) {
  return of({ request, body: { field: "value" } });
}
