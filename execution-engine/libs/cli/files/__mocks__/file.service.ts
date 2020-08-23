let success: boolean = true;

export function __setResponse(pSuccess: boolean): void {
  success = pSuccess;
}

export function fileExists(_path: string): Promise<boolean> {
  return success ? Promise.resolve(true) : Promise.reject();
}

export function ensureDirExists(_path: string): Promise<void> {
  return success ? Promise.resolve() : Promise.reject();
}

export function listDirFiles(path: string): Promise<string[]> {
  return success ? Promise.resolve(["a.json", "b.json", "c.js"]) : Promise.reject();
}

export function readJson(_path: string): Promise<any> {
  return success ? Promise.resolve({}) : Promise.reject();
}

export function writeJson(_path: string, _json: any): Promise<void> {
  return success ? Promise.resolve() : Promise.reject();
}
