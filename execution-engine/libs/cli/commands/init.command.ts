import {
  fileExists,
  writeJiftConfig,
  defaultJiftConfig,
  ensureDirExists,
  jiftConfigName,
} from "../file.service";

export async function init() {
  const configExists = await fileExists(jiftConfigName);
  if (configExists) {
    console.log("This directory is already initialized.");
  } else {
    await writeJiftConfig(defaultJiftConfig);
    await ensureDirExists(defaultJiftConfig.sourceRoot);
  }
}
