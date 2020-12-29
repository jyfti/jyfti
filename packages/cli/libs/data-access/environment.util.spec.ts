import { extractEnvironments, mergeEnvironments } from "./environment.util";

describe("environment utility functions", () => {
  it("extract environments from assignments", () => {
    expect(
      extractEnvironments([
        {
          accessor: ["token"],
          value: "abc",
        },
        {
          accessor: ["github", "auth", "token"],
          value: "def",
        },
      ])
    ).toEqual([
      {
        token: "abc",
      },
      {
        github: {
          auth: {
            token: "def",
          },
        },
      },
    ]);
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
