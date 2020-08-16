import {
  readJiftConfig,
  workflowExists,
  writeWorkflow,
} from "../../file.service";
import { Workflow } from "../../../engine/types/workflow.type";
import inquirer from "inquirer";

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
    name: "",
    inputs: {
      exampleInput: {
        type: "string",
        description:
          "This is an example input that the workflow will validate to receive and will make available to all steps",
      },
    },
    steps: [
      {
        assignTo: "exampleVariable",
        request: {
          method: "GET",
          url:
            "https://raw.githubusercontent.com/fboeller/jift/master/README.md",
        },
      },
    ],
  };
}
