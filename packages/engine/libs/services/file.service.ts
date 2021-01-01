import * as fs from "fs";
import * as nodePath from "path";
import { defer, Observable } from "rxjs";

export function writeFile(
  outRoot: string,
  fileName: string,
  content: Buffer
): Observable<void> {
  return defer(() =>
    fs.promises.writeFile(nodePath.resolve(outRoot, fileName), content, "utf8")
  );
}
