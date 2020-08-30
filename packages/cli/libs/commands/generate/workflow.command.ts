import { readConfig } from "../../data-access/config-file.service";
import { Workflow, RequestStep } from "@jyfti/engine";
import {
  workflowExists,
  writeWorkflow,
} from "../../data-access/workflow-file.service";
import { promptName } from "../../inquirer.service";

export async function generateWorkflow(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    name = await promptName("workflow");
  }
  if (name) {
    if (await workflowExists(config, name)) {
      console.error(
        "The workflow already exists. Please delete the workflow first."
      );
      process.exitCode = 1;
      return;
    }
    const workflow = createExampleWorkflow();
    await writeWorkflow(config, name, workflow);
  }
}

export function createExampleWorkflow(): Workflow {
  return {
    $schema:
      "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
    name: "Retrieve README file of a GitHub repository",
    inputs: {
      org: {
        type: "string",
        description: "The GitHub organization",
        default: "jyfti",
      },
      repo: {
        type: "string",
        description: "The GitHub repository",
        default: "jyfti",
      },
    },
    output: {
      $eval: "readme",
    },
    steps: [
      {
        assignTo: "readme",
        request: {
          method: "GET",
          url:
            "https://raw.githubusercontent.com/${org}/${repo}/master/README.md",
        },
      } as RequestStep,
    ],
  };
}
