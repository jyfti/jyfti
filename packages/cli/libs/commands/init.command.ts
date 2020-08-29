import { fileExists, ensureDirExists } from "../files/file.service";
import {
  configName,
  writeConfig,
  defaultConfig,
} from "../files/config-file.service";

export async function init(): Promise<void> {
  const configExists = await fileExists(configName);
  if (configExists) {
    console.log("This directory is already initialized.");
  } else {
    await writeConfig(defaultConfig);
    await ensureDirExists(defaultConfig.sourceRoot);
  }
}
