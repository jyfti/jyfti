import { executeStep } from "./step-execution";
import { cold } from "jest-marbles";
import { Step, VariableMap } from "../types";

jest.mock("./http");

describe("The execution of steps", () => {

  it("should return an error if no known step type is given", () => {
    const step: Step = {
      assignTo: "myVar"
    };
    expect(executeStep(step, [], {})).toBeObservable(cold("#"));
  });

  describe("a request step", () => {
    it("should return the http response", () => {
      const step: Step = {
        assignTo: "myVar",
        request: { method: "GET", url: "abc", body: null, headers: null },
      };
      expect(executeStep(step, [], {})).toBeObservable(
        cold("(a|)", { a: { request: step.request, body: { field: "value" } } })
      );
    });
  });

  describe("an expression step", () => {
    it("should evaluate an expression", () => {
      const step: Step = {
        assignTo: "myVar",
        expression: {
          $eval: "listVar",
        },
      };
      const variables: VariableMap = {
        listVar: ["a", "b"],
      };
      expect(executeStep(step, [], variables)).toBeObservable(
        cold("(a|)", { a: ["a", "b"] })
      );
    });

    it("should return an error if the evaluation fails", () => {
      const step: Step = {
        assignTo: "myVar",
        expression: "${listVar}",
      };
      const variables: VariableMap = {
        listVar: ["a", "b"],
      };
      expect(executeStep(step, [], variables)).toBeObservable(cold("#"));
    });
  });
  describe("a loop return evaluation step", () => {
    const step: Step = {
      assignTo: "myVar",
      for: {
        const: "loopVar",
        in: {
          $eval: "listVar",
        },
        do: [
          {
            assignTo: "innerVar",
            expression: 2,
          },
        ],
        return: "innerVar",
      },
    };

    it("should return the collection of all inner variable values of the return variable", () => {
      expect(
        executeStep(step, [[2], [2], [2], [2], [2]], {
          listVar: ["a", "b", "c", "d", "e"],
        })
      ).toBeObservable(cold("(a|)", { a: [2, 2, 2, 2, 2] }));
    });

    it("should return an error if the local evaluations aren't an array", () => {
      expect(
        executeStep(
          step,
          { not: "an array" },
          {
            listVar: ["a", "b", "c", "d", "e"],
          }
        )
      ).toBeObservable(cold("#"));
    });
  });
});
