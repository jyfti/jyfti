import { extractEnvironment, mergeEnvironments } from "./environment.util";

describe("environment utility functions", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("parses a flat assigment into an environment", () => {
    process.env.ENV_VAR = "envVarValue";
    const module = require("./environment.util");
    expect(module.parseAssignment("envVar=ENV_VAR", {})).toEqual({
      envVar: "envVarValue",
    });
  });

  it("parses a nested assigment into an environment", () => {
    process.env.GITHUB_TOKEN = "tokenValue";
    const module = require("./environment.util");
    expect(
      module.parseAssignment("github.auth.token=GITHUB_TOKEN", {})
    ).toEqual({
      github: { auth: { token: "tokenValue" } },
    });
  });

  it("extracts a flat environment from an assignment", () => {
    expect(extractEnvironment(["token"], "abc")).toEqual({
      token: "abc",
    });
  });

  it("extracts a nested environment from an assignment", () => {
    expect(extractEnvironment(["github", "auth", "token"], "def")).toEqual({
      github: {
        auth: {
          token: "def",
        },
      },
    });
  });

  // TODO Nested environments should not be overridden, but the merging should recursively continue
  it("merges environments and prefers later environments", () => {
    expect(
      mergeEnvironments([
        { a: "a1", b: "b1", c: "c1" },
        { a: "a2", b: "b2" },
        { a: "a3" },
      ])
    ).toEqual({ a: "a3", b: "b2", c: "c1" });
  });
});
