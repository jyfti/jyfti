import * as fs from "fs";

export function fileExists(path: string): Promise<boolean> {
  return fs.promises
    .stat(path)
    .then(() => true)
    .catch(() => false);
}

export async function ensureDirExists(path: string): Promise<void> {
  const exists = await fileExists(path);
  if (!exists) {
    await fs.promises.mkdir(path);
  }
}

export function readJson(path: string): Promise<any> {
  return fs.promises.readFile(path, "utf8").then(JSON.parse);
}

export function writeJson(path: string, json: any): Promise<void> {
  const data = JSON.stringify(json, null, 2);
  return fs.promises.writeFile(path, data, "utf8");
}
