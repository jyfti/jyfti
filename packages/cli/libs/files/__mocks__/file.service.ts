let success = true;

export function __setResponse(pSuccess: boolean): void {
  success = pSuccess;
}

export function fileExists(): Promise<boolean> {
  return Promise.resolve(success);
}

export function ensureDirExists(): Promise<void> {
  return success ? Promise.resolve() : Promise.reject();
}

export function listDirFiles(): Promise<string[]> {
  return success
    ? Promise.resolve(["a.json", "b.json", "c.js"])
    : Promise.reject();
}

export function readJson(): Promise<unknown> {
  return success ? Promise.resolve({}) : Promise.reject();
}

export function writeJson(): Promise<void> {
  return success ? Promise.resolve() : Promise.reject();
}
