import {
  fileExists,
  writeJiftConfig,
  defaultJiftConfig,
} from "../file.service";

export async function init() {
  const configExists = await fileExists("jift.json");
  if (configExists) {
    console.log("This directory is already initialized.");
  } else {
    writeJiftConfig(defaultJiftConfig);
  }
}
