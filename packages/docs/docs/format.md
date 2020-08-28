---
id: format
title: The Jyfti Format
---

The Jyfti format expresses the concept of a workflow that accepts a couple of inputs, executes a sequence of steps and returns with an output.

A simple example is the `retrieve-readme` workflow.

```json
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

## Schema

The optional `$schema` defines the json schema which editors should validate against and use for auto-completion.

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json"
}
```

## Inputs

The `inputs` field defines a list of inputs to your workflow.
Each input is assigned a [json schema](https://json-schema.org/) that Jyfti uses to validate and prompt for input.

> **Note:** Inputs can be defined to be arbitrary json, but the CLI of Jyfti only reads flat inputs like strings and numbers.

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

## Output

The `output` field defines the [JSON-e expression](https://json-e.js.org/) that is returned after the workflow completed all steps.

```json
{
  "output": {
    "$eval": "readmeResponse.body"
  }
}
```

## Steps

The `steps` field defines a sequence of steps that are executed one after the other.
Each step evaluates to a value that can be optionally assigned to a variable with `assignTo`.
A step can access the variables populated by all previous step.

There are three different types of steps.

- Request steps
- Expression steps
- For-comprehensions

### Request steps

A request step defines a single http request.

```json
{
  "assignTo": "readmeResponse",
  "request": {
    "method": "GET",
    "url": "https://raw.githubusercontent.com/${org}/${repo}/master/README.md",
    "body": {
      "$eval": "${previousResponse.body}"
    },
    "headers": {
      "Authorization": "Bearer ${token}"
    }
  }
}
```

It requires a `url` and optionally accepts a `method`, `body` and `headers`.
Each of these fields is evaluated as a [JSON-e expression](https://json-e.js.org/).

### Expression steps

An expression defines a transformation from one json object into another.
It is useful to transform the output of one request step into the input of another request step.

```json
{
  "assignTo": "variable",
  "expression": {
    "e": "${a.b}"
  }
}
```

The value of the `expression` field is defined as a [JSON-e expression](https://json-e.js.org/).

### For-comprehensions

In cases, where you need to execute a couple of steps for each item in a list, a for-comprehesion step can come in handy.

```json
{
  "assignTo": "bodies",
  "for": {
    "const": "url",
    "in": { "$eval": "urls" },
    "do": [
      {
        "assignTo": "response",
        "request": {
          "url": "${url}"
        }
      },
      {
        "assignTo": "body",
        "expression": {
          "$eval": "response.body"
        }
      }
    ],
    "return": "body"
  }
}
```

It requires four fields `const`, `in`, `do` and `return`.
It evaluates the [JSON-e expression](https://json-e.js.org/) of the field `in` and expects it to evaluate to a list.
Then, it executes all the steps of the `do` list for each element in the list.
The element of the list is available via the name defined with the field `const`.
Once all steps are executed for all elements of the list, the for-comprehension returns a list of all the variable values defined with the field `return`.

> **Note:** For-comprehension steps can contain for-comprehension steps itself.