---
id: introduction
title: Introduction
---

![License](https://img.shields.io/github/license/jyfti/jyfti) ![Build](https://img.shields.io/github/workflow/status/jyfti/jyfti/CI) ![Code Coverage](https://img.shields.io/codecov/c/github/jyfti/jyfti) ![Version](https://img.shields.io/npm/v/@jyfti/cli)

Jyfti is a project for building, running and sharing workflows easily.

- **Json-based** — Workflows are just JSON files. They can be checked into source control and compared via diffing tools.

- **Validation with json schema** — Workflows adhere to a JSON schema. That way common editors are able to provide auto-completion and validation. Workflow inputs and environments can be specified to adhere to a json schema, enabling validation and prompting for inputs in CLI.

- **Execute anywhere** — Jyfti is stateless by default. This allows local execution, easy sharing of workflows and reproduction of issues in other environments like CI servers.

- **Step-by-step execution** — Unsure what's going on in your workflow? Jyfti can execute workflows step-by-step giving you the ability to debug a workflow and giving a CI server the ability to stay in control.