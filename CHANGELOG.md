# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- If the workflow execution fails, the CLI now returns a non-zero exit code.

## [0.2.0] - 2020-01-03

### Added

- Shell steps that can execute a command on a shell and assign the stdout to a variable
- A require section for each step that causes the engine to stop and the CLI to inquire input and only then to proceed
- A GitHub artifact workflow that retrieves a remote workflow state for local inspection
- The CLI considers the `enum` field on workflow inputs and the new require section to inquire from a set of values
- A `find` function in `json-e` expressions

### Changed

- The engine now requires the `outRoot` as a parameter
- The state format now contains the `lastStep` as a field instead of the last `error`.
