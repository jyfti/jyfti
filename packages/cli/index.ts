#!/usr/bin/env node

import { createProgram } from "./libs/program";

(async () => {
  try {
    const program = createProgram();
    await program.parseAsync(process.argv);
  } catch (err) {
    console.error(err);
  }
})();
