import { readJiftConfig, readState } from "../file.service";

export async function status(name: string) {
  const jiftConfig = await readJiftConfig();
  const message = await readState(jiftConfig, name)
    .then((state) => state.path)
    .then((path) =>
      path.length != 0
        ? "The workflow is at step " + JSON.stringify(path)
        : "The workflow is completed."
    )
    .catch((err) => "The workflow does not have an open execution state.");
  console.log(message);
}
