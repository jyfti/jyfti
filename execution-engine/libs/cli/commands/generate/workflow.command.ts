import { readJiftConfig } from "../../files/file.service";
import inquirer from "inquirer";
import { Workflow } from "../../../engine/types";
import {
  workflowExists,
  writeWorkflow,
} from "../../files/workflow-file.service";

export async function generateWorkflow(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    const answers = await inquirer.prompt([
      {
        name: "name",
        message: "What shall be the name of the workflow?",
        type: "string",
        default: "example-workflow",
      },
    ]);
    name = answers.name;
  }
  if (name) {
    if (await workflowExists(jiftConfig, name)) {
      console.error(
        "The workflow already exists. Please delete the workflow first."
      );
      process.exit(1);
    }
    const workflow = createExampleWorkflow();
    await writeWorkflow(jiftConfig, name, workflow);
  }
}

export function createExampleWorkflow(): Workflow {
  return {
    $schema:
      "https://raw.githubusercontent.com/fboeller/jift/master/workflow-schema.json",
    name: "Retrieve README file of a GitHub repository",
    inputs: {
      org: {
        type: "string",
        description: "The GitHub organization",
        default: "fboeller",
      },
      repo: {
        type: "string",
        description: "The GitHub repository",
        default: "jift",
      },
    },
    steps: [
      {
        assignTo: "exampleVariable",
        request: {
          method: "GET",
          url:
            "https://raw.githubusercontent.com/${org}/${repo}/master/README.md",
        },
      },
    ],
  };
}
