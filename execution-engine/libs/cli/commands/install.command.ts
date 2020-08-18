import { readConfig } from "../files/config-file.service";

import bent from "bent";
import {
  writeWorkflow,
  readWorkflowSchemaOrTerminate,
} from "../files/workflow-file.service";
import { Workflow } from "../../engine/types";
import { validateWorkflow } from "../../engine/services/validator.service";
import { printValidationErrors } from "../print.service";
import chalk from "chalk";

const getJson = bent("json");

export async function install(url: string) {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  const workflow = (await getJson(url).catch((err) => {
    console.error("The workflow could not be retrieved.");
    console.error(err);
    return null;
  })) as Workflow | null;
  if (workflow) {
    const errors = validateWorkflow(workflow, schema);
    if (errors.length !== 0) {
      console.error(chalk.red("The workflow is not valid."));
      console.error(printValidationErrors(errors));
      process.exit(1);
    }
    await writeWorkflow(config, extractWorkflowName(url), workflow);
  }
}

function extractWorkflowName(url: string): string {
  const segments = new URL(url).pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  return lastSegment.endsWith(".json")
    ? lastSegment.substring(0, lastSegment.length - ".json".length)
    : lastSegment;
}
