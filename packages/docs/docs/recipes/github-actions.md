---
id: github-actions
title: GitHub Actions
---

You can run a Jyfti workflow on GitHub Actions.
This way, it is possible to run a workflow on a schedule or as a reaction to GitHub events.
The advantage of using Jyfti on GitHub Actions instead of plain GitHub Actions is that you gain the ability to run a workflow both locally as well as remotely.
It is even possible to retrieve the state of a Jyfti workflow from GitHub Actions and to locally debug it.

A pure Jyfti workflow on GitHub Actions typically consists of five steps:

- Checking out the repo
- Setting up node
- Installing the Jyfti CLI
- Running the workflow
- Storing the Jyfti state artifact

```yaml
name: Retrieve README

on:
  schedule:
    - cron: "0 10 * * *"
  workflow_dispatch:

jobs:
  workflow:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js environment
        uses: actions/setup-node@v2

      - name: Install npm packages
        run: npm install @jyfti/cli

      - name: Run workflow
        run: npx jyfti run https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/retrieve-readme.json jyfti example-repo

      - uses: actions/upload-artifact@v2
        with:
          name: jyfti-states
          path: ./out
```

## Secrets

For many you might want to pass secrets from the environment to the Jyfti workflow such that Jyfti can execute authenticated HTTP requests.
Assuming that you have a GitHub environment holding your secrets, you can pass each field of a Jyfti environment as environment variable.

```yaml
jobs:
  workflow:
    runs-on: ubuntu-latest
    environment: Slack
    steps:
      - ...
      - name: Run workflow
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: npx jyfti run --env-var slackWebhookUrl=SLACK_WEBHOOK_URL https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/open-prs-to-slack.json jyfti example-repo
```

It is possible to pass nested fields like `--env-var github.token=GITHUB_TOKEN`.

```json
{
  "github": {
    "token": "xxxxxxxxx"
  }
}
```

If there exists an environment file, then the passed environment variables overwrite the specific values of that file.