import { readJiftConfig, readJson, readWorkflow } from "../file.service";
import { promptWorkflow } from "../inquirer.service";
import Ajv from "ajv";

export async function validate(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to validate?"
    );
  }
  if (name) {
    const workflow = await readWorkflow(jiftConfig, name);
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(await readJson("../workflow-schema.json"));
    const valid = validate(workflow);
    if (!valid) {
      console.log(validate.errors);
      process.exit(1);
    }
  }
}
