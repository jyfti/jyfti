import { fileExists, ensureDirExists } from "../files/file.service";
import { configName, writeConfig } from "../files/config-file.service";
import inquirer from "inquirer";
import { Config } from "../types/config";

export async function init(): Promise<void> {
  const configExists = await fileExists(configName);
  if (configExists) {
    console.log("This directory is already initialized.");
  } else {
    const config = await promptConfig();
    await writeConfig(config);
    await ensureDirExists(config.sourceRoot);
    await ensureDirExists(config.envRoot);
    await ensureDirExists(config.outRoot);
    console.log("Initialized Jyfti project.");
  }
}

async function promptConfig(): Promise<Config> {
  const answers = await inquirer.prompt([
    {
      name: "sourceRoot",
      message: `Where do you want to put the workflows?`,
      type: "string",
      default: "./src",
    },
    {
      name: "envRoot",
      message: `Where do you want to put the environments?`,
      type: "string",
      default: "./environments",
    },
    {
      name: "outRoot",
      message: `Where should the execution states be stored?`,
      type: "string",
      default: "./out",
    },
    {
      name: "schemaLocation",
      message: `Which workflow schema should be validated against?`,
      type: "string",
      default:
        "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
    },
  ]);
  return {
    sourceRoot: answers.sourceRoot,
    envRoot: answers.envRoot,
    outRoot: answers.outRoot,
    schemaLocation: answers.schemaLocation,
  };
}
