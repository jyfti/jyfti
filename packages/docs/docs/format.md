---
id: format
title: The Jyfti Format
---

## Steps

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

// TODO: Describe via REST example