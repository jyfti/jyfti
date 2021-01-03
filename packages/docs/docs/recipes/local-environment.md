---
id: local-environment
title: Local environment
---

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
