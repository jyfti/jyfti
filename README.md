# Jyfti

![License](https://img.shields.io/github/license/jyfti/jyfti) ![Build](https://img.shields.io/github/workflow/status/jyfti/jyfti/CI) ![Code Coverage](https://img.shields.io/codecov/c/github/jyfti/jyfti) ![Version](https://img.shields.io/npm/v/@jyfti/cli)

[Jyfti](https://jyfti.github.io/jyfti) is a project for building, running and sharing workflows easily.

- **Json-based** — Workflows are standalone JSON files. Thus, they can be put into Git and parsed by programs.

- **Validation with json schema** — Workflows adhere to a JSON schema. That way common editors are able to provide auto-completion and validation. Workflow inputs and environments can be specified to adhere to a json schema, enabling validation and prompting for inputs in CLI.

- **Execute anywhere** — The Jyfti CLI reads and writes on the file system. This allows Jyfti to be executed on a CI server as well as on a local computer.

- **Step-by-step execution** — Unsure what's going on in your workflow? Jyfti can execute workflows step-by-step with intermediary states. Copy these states from CI and you can reproduce an issue locally.

![Usage example](./packages/docs/static/img/terminalizer.gif)

## Quickstart

```
$ npm install -g @jyfti/cli
$ jyfti --help
```

## Usage

Visit the [online documentation](https://jyfti.github.io/jyfti/docs/usage) of Jyfti.
