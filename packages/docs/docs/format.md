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
Note that, for-comprehensions can contain for-comprehension itself.