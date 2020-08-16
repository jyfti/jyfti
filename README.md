# Jyfti - The workflow engine for software engineers

Jyfti is a json-based, light-weight workflow engine that makes it easy to connect APIs transparently.
It defines a JSON format that is able to express a sequence of steps that can be executed on a trigger.

## The Jyfti format

// TODO: Describe

## The execution engine

// TODO: Describe

## What is Jyfti?

### Json-based

The workflows are plain JSON files that can be checked in into source control and compared via diffing tools.
They adhere to a JSON schema, such that common editors are able to provide auto-completion and validation.
Still, these JSON files can be visualized in a UI to make the according process more approachable to people without a technical background.

### Light-weight

The JSON format is minimal. If things get more complex, they can be moved into a service or serverless lambda and be called from the workflow. 
The execution engine is a single npm package with `rxjs` as only dependency.

### Transparent

The execution engine executes a workflow step-by-step, each time returning a JSON fully representing the current state of the execution. 
This has several advantages:
- The intermediate states can be persisted
- The intermediate states can be visualized
- The steps can be executed on different nodes
- A failed step can be repeated

## What is Jyfti not?

### A full programming language

Jyfti does not aim to replace programming languages.
Instead, it embraces services with well-defined APIs and only provides the necessary tools to connect these APIs.

## Why another workflow engine?

There is a variety of tools that try to solve a similar problem.
Many of these tools aim to partially or completely replace traditional programming languages with their environment.
They are targeted at people without a software engineering background but with a need to model processes.
They are often based on a graphical editor with a drag-and-drop interface.

While these graphical interfaces can make modelling more approachable for people without a technical background, they are less convenient for people that use text-based editors on a day-to-day basis.
Version control systems like `git` are not usable with these graphical languages. 
They can only work on their suboptimal serialized form which makes pull requests a nightmare.
Even worse, if the execution is also happening exclusively within a UI, it makes it impossible to use established tools for testing and CI/CD.