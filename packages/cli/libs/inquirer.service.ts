import inquirer from "inquirer";
import { JsonSchema, Workflow } from "@jyfti/engine";

export async function promptName(entity: string): Promise<string> {
  const answers = await inquirer.prompt([
    {
      name: "name",
      message: `What shall be the name of the ${entity}?`,
      type: "string",
      default: "default",
    },
  ]);
  return answers.name;
}

export async function promptWorkflow(
  names: string[],
  question: string
): Promise<string | undefined> {
  const answers = await inquirer.prompt([
    {
      name: "workflow",
      message: question,
      type: "list",
      choices: names,
    },
  ]);
  return answers.workflow;
}

export async function promptWorkflowInputs(
  workflow: Workflow
): Promise<string[]> {
  const inputs = workflow?.inputs || {};
  const answers = await promptInputs(inputs);
  return Object.keys(inputs).map((fieldName) => answers[fieldName]);
}

export function promptInputs(
  inputs: Record<string, JsonSchema>
): Promise<Record<string, string>> {
  // TODO This implicitly relies on a specific structure in the schema
  return inquirer.prompt(
    Object.keys(inputs).map((fieldName) =>
      jsonSchemaToInquirer(fieldName, inputs[fieldName])
    )
  );
}

function jsonSchemaToInquirer(
  fieldName: string,
  schema: Record<string, unknown>
): unknown {
  return {
    name: fieldName,
    message: schema?.description as string,
    type: schema?.enum ? "list" : "string",
    default: schema?.default,
    choices: schema?.enum,
  };
}
