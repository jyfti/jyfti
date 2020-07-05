import { walk } from "https://deno.land/std/fs/mod.ts";

const dir = Deno.args[0];

async function createIndex() {
  for await (const entry of walk(dir, {
    maxDepth: 1,
    includeFiles: true,
    includeDirs: false,
  })) {
    console.log(entry.name);
  }
}

createIndex().then(() => console.log("Done!"));
