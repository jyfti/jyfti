import { walk, WalkEntry } from "https://deno.land/std/fs/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

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

const server = serve({ port: 4201 });

console.log("Listening on http://localhost:4201/");

for await (const req of server) {
  if (req.url === "/") {
    req.respond({ body: JSON.stringify(dataflowIds) });
  } else {
    req.respond({ status: 404, body: "Not found" });
  }
}
