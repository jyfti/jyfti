import { Step } from "../types";
import {
  resolveStepRec,
  resolveAllStepsRec,
  resolveLoopPositions,
} from "./step-resolvement";

describe("the resolvement of steps", () => {
  describe("resolving the deepest step at a path", () => {
    it("should resolve the first step of a flat workflow", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          expression: 1,
        },
      ];
      expect(resolveStepRec(steps, [0])).toEqual(steps[0]);
    });

    it("should resolve the second step of a workflow", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          expression: 1,
        },
        {
          assignTo: "var2",
          expression: 2,
        },
      ];
      expect(resolveStepRec(steps, [1])).toEqual(steps[1]);
    });

    it("should resolve the first step of a loop", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          for: {
            const: "loopVar",
            in: "listVar",
            do: [
              {
                assignTo: "var2",
                expression: 2,
              },
            ],
            return: "loopVar",
          },
        },
      ];
      expect(resolveStepRec(steps, [0, 0, 0])).toEqual(steps[0].for?.do[0]);
    });

    it("should resolve a loop itself", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          for: {
            const: "loopVar",
            in: "listVar",
            do: [
              {
                assignTo: "var2",
                expression: 2,
              },
            ],
            return: "loopVar",
          },
        },
      ];
      expect(resolveStepRec(steps, [0])).toEqual(steps[0]);
    });
  });

  describe("resolving all steps under a path", () => {
    it("should resolve the first step of a flat workflow", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          expression: 1,
        },
      ];
      expect(resolveAllStepsRec(steps, [0])).toEqual([steps[0]]);
    });

    it("should resolve a loop recursively", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          for: {
            const: "loopVar",
            in: "listVar",
            do: [
              {
                assignTo: "var2",
                expression: 2,
              },
            ],
            return: "loopVar",
          },
        },
      ];
      expect(resolveAllStepsRec(steps, [0, 0, 0])).toEqual([
        steps[0],
        steps[0].for?.do[0],
      ]);
    });
  });

  describe("resolving loop positions under a path", () => {
    it("should resolve to empty array in a flat workflow", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          expression: 1,
        },
      ];
      expect(resolveLoopPositions(steps, [0])).toEqual([]);
    });

    it("should resolve a loop recursively", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          for: {
            const: "loopVar",
            in: "listVar",
            do: [
              {
                assignTo: "var2",
                expression: 2,
              },
            ],
            return: "loopVar",
          },
        },
      ];
      expect(resolveLoopPositions(steps, [0, 0, 0])).toEqual([0]);
    });
  });
});
