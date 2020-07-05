import { walk, WalkEntry } from "https://deno.land/std/fs/mod.ts";
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const dir = Deno.args[0];

async function readDataflows(): Promise<WalkEntry[]> {
  let result = [];
  for await (const entry of walk(dir, {
    maxDepth: 1,
    includeFiles: true,
    includeDirs: false,
  })) {
    result.push(entry);
  }
  return result;
}

function stripSuffix(path: string) {
  return path.substring(0, path.length - ".json".length);
}

function extractDataflowIds(dataflows: WalkEntry[]) {
  return dataflows
    .filter((entry: WalkEntry) => entry.name.endsWith(".json"))
    .map((entry: WalkEntry) => stripSuffix(entry.name));
}

const dataflows = await readDataflows();
const dataflowIds = extractDataflowIds(dataflows);

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = dataflowIds;
  })
  .get("/:dataflow", async (context) => {
    await send(context, context?.params?.dataflow + ".json", {
      root: `${Deno.cwd()}/dataflows`,
    });
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 4201 });
