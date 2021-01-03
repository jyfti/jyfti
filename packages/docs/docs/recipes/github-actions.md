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

## Local execution

If a Jyfti workflow has failed, you can inspect and re-execute it locally from the point where it failed.
You can use the `github-artifact` workflow to copy the remote workflow state into your local state directory. 

```
$ jyfti run https://raw.githubusercontent.com/jyfti/jyfti/master/workflows/github-artifact.json
? The GitHub organization jyfti
? The GitHub repository example-repo
✔ Initialized
✔ [0] Retrieve workflow runs
ℹ [1] Retrieve artifacts
? The GitHub workflow run id 459006661
✔ [1] Retrieve artifacts
✔ [2] Retrieve artifact download url
✔ [3] Download artifact
✔ [4] Unzip artifact
✔ [5] Remove zip file
Archive:  artifact.zip
  inflating: open-prs-to-slack.state.json
```

Then, you can proceed with the now local workflow state.

```
$ jyfti run status open-prs-to-slack
$ jyfti run state open-prs-to-slack
$ jyfti run complete open-prs-to-slack
```

Note that this only copies the workflow state and not the workflow itself.
It is recommended to store the workflows in git.

If your CI environment passes environment variables to the Jyfti workflow, then you can either pass the environment variables locally as well or store them in your local environment file.

## Only save failures

If a Jyfti workflow succeeds, you might not be interested in the workflow state and therefore don't store it.
You can do so via an if-condition in the GitHub Actions workflow.

```yaml
- uses: actions/upload-artifact@v2
  if: ${{ failure() }}
  with:
    name: jyfti-states
    path: ./out
```
