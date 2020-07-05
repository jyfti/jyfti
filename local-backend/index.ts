import { walk, WalkEntry } from "https://deno.land/std/fs/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

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

function extractDataflowIds(dataflows: WalkEntry[]) {
  return dataflows
    .filter((entry: WalkEntry) => entry.name.endsWith(".json"))
    .map((entry: WalkEntry) =>
      entry.name.substring(0, entry.name.length - ".json".length)
    );
}

const dataflows = await readDataflows();
const dataflowIds = extractDataflowIds(dataflows);

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = dataflowIds;
  });

const app = new Application();
app.use(router.routes());
await app.listen({ port: 4201 });
