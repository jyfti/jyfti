import { walk, WalkEntry, writeJson } from "https://deno.land/std/fs/mod.ts";
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const dir = Deno.args[0];

async function readFiles(): Promise<WalkEntry[]> {
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

function extractDataflows(files: WalkEntry[]) {
  return files
    .filter((entry: WalkEntry) => entry.name.endsWith(".json"))
    .map((entry: WalkEntry) => stripSuffix(entry.name))
    .map((id: string) => ({ id }));
}

const files = await readFiles();
const dataflows = extractDataflows(files);

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = dataflows;
  })
  .get("/:dataflow", async (context) => {
    await send(context, context?.params?.dataflow + ".json", {
      root: `${Deno.cwd()}/dataflows`,
    });
  })
  .put("/:dataflow", async (context) => {
    const body = (await context.request.body()).value;
    console.log(body);
    await writeJson(
      `${Deno.cwd()}/dataflows/${context?.params?.dataflow}.json`,
      body,
      { spaces: 2 }
    );
    context.response.body = "Success";
  });

const app = new Application();
app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
});
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 4201 });
