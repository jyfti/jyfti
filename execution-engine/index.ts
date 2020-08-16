#!/usr/bin/env node

import { createProgram } from "./libs/cli/program";

const program = createProgram();

program.parse(process.argv);
