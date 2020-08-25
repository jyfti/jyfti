---
id: usage
title: Usage
---

## Running a workflow

Run your first workflow.

```
$ jyfti run https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/retrieve-readme.json
```

Jyfti runs remote and local workflows.
The preferred way of developing workflows is within a local Jyfti project.

Initialize a Jyfti project within your current directory.

```
$ jyfti init
```

This results in a `jyfti.json` to be created where the configuration for your Jyfti project resides.

Then, generate your first workflow.

```
$ jyfti generate workflow retrieve-readme
```

The workflow is generated into the `sourceRoot` directory as `retrieve-readme.json`.
It serves you as a foundation to create your first productive workflow.

Run the workflow to completion.

```
$ jyfti run retrieve-readme
? The GitHub organization (jyfti)
? The GitHub repository (jyfti)
```

Jyfti prompts for inputs that the workflow expects.
Note that inputs can also be passed directly.

```
$ jyfti run retrieve-readme jyfti jyfti
```

## Creating a workflow

Let's inspect the generated `retrieve-readme` workflow.

```json
$ jyfti view retrieve-readme
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
  "name": "Retrieve README file of a GitHub repository",
  "inputs": {
    "org": {
      "type": "string",
      "description": "The GitHub organization",
      "default": "jyfti"
    },
    "repo": {
      "type": "string",
      "description": "The GitHub repository",
      "default": "jyfti"
    }
  },
  "output": {
    "$eval": "readmeResponse.body"
  },
  "steps": [
    {
      "assignTo": "readmeResponse",
      "request": {
        "method": "GET",
        "url": "https://raw.githubusercontent.com/${org}/${repo}/master/README.md"
      }
    }
  ]
}
```

The `$schema` field allows editors like VSCode to validate your workflow against a schema and to autocomplete.

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json"
}
```

The `inputs` field defines a list of inputs to your workflow.
Each input is assigned a [json schema](https://json-schema.org/) that Jyfti uses to validate and prompt for input.
Note that inputs can be defined to be arbitrary json, but the CLI of Jyfti only reads flat inputs like strings and numbers.

```json
{
  "inputs": {
    "org": {
      "type": "string",
      "description": "The GitHub organization",
      "default": "jyfti"
    },
    "repo": {
      "type": "string",
      "description": "The GitHub repository",
      "default": "jyfti"
    }
  }
}
```

The `steps` field defines a sequence of steps that are executed one after the other.
Each step evaluates to a value that can be assigned to a variable with `assignTo`.
A step can access the variables populated by all previous step.
Read more about steps in the [steps section](#steps).

The `output` field defines the [JSON-e expression](https://json-e.js.org/) that is returned after the workflow completed all steps.

```json
{
  "output": {
    "$eval": "readmeResponse.body"
  }
}
```

## Step-by-step execution

While `jyfti run <name>` executes a workflow from start to finish, Jifty can also execute a workflow step-by-step persisting intermediate states to disk.

A step-by-step workflow run is created via the `create` subcommand.

```bash
$ jyfti run create retrieve-readme jyfti jyfti
Created state.
```

The `create` subcommand validates the input and writes the initial state to disk.
The run can get advanced with the `step` subcommand.

```bash
$ jyfti run step retrieve-readme
Completed 0
```

At any point, the status, the state and the variables can be requested.

```bash
$ jyfti run status retrieve-readme
[Pending] At step [0]
$ jyfti run state retrieve-readme
{
  "path": [
    0
  ],
  "inputs": {
    "org": "jyfti",
    "repo": "jyfti"
  },
  "evaluations": []
}
$ jyfti run vars retrieve-readme
{
  "org": "jyfti",
  "repo": "jyfti"
}
```

A call to `complete` runs it to completion.

```bash
$ jyfti run complete retrieve-readme
Completed 0
```
