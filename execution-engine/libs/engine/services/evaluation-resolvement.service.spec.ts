import { EvaluationResolvementService } from "./evaluation-resolvement.service";

describe("EvaluationResolvementService", () => {
  let service = new EvaluationResolvementService();

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it.each([
    ["a", [], "a"],
    [["a"], [0], "a"],
    [["a", "b"], [1], "b"],
    [["a", ["b", "c"]], [1], ["b", "c"]],
    [["a", ["b", "c"]], [1, 1], "c"],
  ])("resolveEvaluation(%s, %s)=%s", (evaluations, path, expectation) => {
    expect(service.resolveEvaluation(evaluations, path)).toEqual(expectation);
  });

  it.each([
    [[], [], "a", ["a"]],
    [[0], [], "a", ["a"]],
    [[1], ["a"], "b", ["a", "b"]],
    [[1, 0], ["a"], "b", ["a", ["b"]]],
    [[1, 0, 0], ["a"], "b", ["a", [["b"]]]],
    [[0], [[["a"]]], "b", ["b"]],
  ])(
    "addEvaluation(%s, %s, %s)=%s",
    (path, evaluations, evaluation, expectation) => {
      expect(service.addEvaluation(path, evaluations, evaluation)).toEqual(
        expectation
      );
    }
  );
});
