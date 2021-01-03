---
id: authentication
title: Authentication
---

If you want to access protected APIs, you usually need to provide some form of credentials.
There are two ways to provide them without exposing them to the terminal history.

They can be provided via inputs from environment variables.

```bash
$ jyfti run my-workflow $TOKEN
```

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
  "inputs": {
    "token": {
      "type": "string"
    }
  },
  ...
}
```

They can also be provided via an environment file.

```bash
$ jyfti run my-workflow -e my-environment
```

```json
{
  "token": "<secret-token>"
}
```

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
  "env": {
    "token": {
      "type": "string"
    }
  },
  ...
}
```

In a workflow, the token can be accessed and added to a header.

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
  "name": "Retrieve the current status of the rate limit at GitHub",
  "env": {
    "token": {
      "type": "string"
    }
  },
  "steps": [
    {
      "assignTo": "rateLimit",
      "request": {
        "url": "https://api.github.com/rate_limit",
        "headers": {
          "Authorization": "token ${env.token}"
        }
      }
    }
  ]
}
```

If you need to send the same headers multiple times, it is also possible to extract the header creation.

```json
{
  "steps": [
    {
      "assignTo": "headers",
      "expression": {
        "Authorization": "token ${env.token}"
      }
    },
    {
      "assignTo": "rateLimit",
      "request": {
        "url": "https://api.github.com/rate_limit",
        "headers": {
          "$eval": "headers"
        }
      }
    }
  ]
}
```
