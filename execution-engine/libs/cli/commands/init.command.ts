import { fileExists, ensureDirExists } from "../files/file.service";
import {
  jiftConfigName,
  writeJiftConfig,
  defaultJiftConfig,
} from "../files/config-file.service";

export async function init() {
  const configExists = await fileExists(jiftConfigName);
  if (configExists) {
    console.log("This directory is already initialized.");
  } else {
    await writeJiftConfig(defaultJiftConfig);
    await ensureDirExists(defaultJiftConfig.sourceRoot);
  }
}
