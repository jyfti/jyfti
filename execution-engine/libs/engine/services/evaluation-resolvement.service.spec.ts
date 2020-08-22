import {
  resolveEvaluation,
  addEvaluation,
} from "./evaluation-resolvement.service";

describe("the resolvement of evaluations", () => {
  it.each([
    ["a", [], "a"],
    [["a"], [0], "a"],
    [["a", "b"], [1], "b"],
    [["a", ["b", "c"]], [1], ["b", "c"]],
    [["a", ["b", "c"]], [1, 1], "c"],
  ])("resolveEvaluation(%s, %s)=%s", (evaluations, path, expectation) => {
    expect(resolveEvaluation(evaluations, path)).toEqual(expectation);
  });

  it.each([
    [[], [], "a", ["a"]],
    [[0], [], "a", ["a"]],
    [[1], ["a"], "b", ["a", "b"]],
    [[1, 0], ["a"], "b", ["a", ["b"]]],
    [[1, 0, 0], ["a"], "b", ["a", [["b"]]]],
    [[0, 0, 1], [[["a"]]], "b", [[["a", "b"]]]],
    [[0, 1, 0], [[["a"]]], "b", [[["a"], ["b"]]]],
    [[0, 1, 0], [[["a", "b"]]], "c", [[["a", "b"], ["c"]]]],
    [
      [0, 1, 1],
      [[["a", "b"], ["c"]]],
      "d",
      [
        [
          ["a", "b"],
          ["c", "d"],
        ],
      ],
    ],
    [[0], [[["a"]]], "b", ["b"]],
  ])(
    "addEvaluation(%s, %s, %s)=%s",
    (path, evaluations, evaluation, expectation) => {
      expect(addEvaluation(path, evaluations, evaluation)).toEqual(expectation);
    }
  );
});
