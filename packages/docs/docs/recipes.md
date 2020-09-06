---
id: recipes
title: Recipes
---

## Local environment

If you develop or test workflows, you might not want to access the production systems.
In these cases, environments can be used to access test systems or mocks instead.

Assuming there is an environment `prod`.

```json
{
  "baseUrl": "https://api.github.com"
}
```

Then, there can be an environment `local` of the same structure.

```json
{
  "baseUrl": "http://localhost:8080"
}
```

The workflow can then define to use the base url from the environment.

```json
{
  "$schema": "https://raw.githubusercontent.com/jyfti/jyfti/master/workflow-schema.json",
  "name": "Retrieve the current status of the rate limit at GitHub",
  "env": {
    "baseUrl": {
      "type": "string"
    }
  },
  "output": {
    "$eval": "rateLimit"
  },
  "steps": [
    {
      "assignTo": "rateLimit",
      "request": {
        "url": "${env.baseUrl}/rate_limit"
      }
    }
  ]
}
```

Via the environment option, a run can be started with one of these environments.

```bash
$ jyfti run -e prod
$ jyfti run -e local
```

For the local environment, a technology such as [MockServer](https://www.mock-server.com/) or [Mountebank](http://www.mbtest.org/docs/gettingStarted) can be used to mock the http calls.

## Authentication

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
