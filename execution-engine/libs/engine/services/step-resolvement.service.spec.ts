import { StepResolvementService } from "./step-resolvement.service";
import { Step } from "../types";

describe("StepResolvementService", () => {
  let service = new StepResolvementService();

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("resolving the deepest step at a path", () => {
    it("should resolve the first step of a flat workflow", () => {
      const steps: Step[] = [
        {
          assignTo: "var1",
          expression: 1,
        },
      ];
      expect(service.resolveStepRec(steps, [0])).toEqual(steps[0]);
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
      expect(service.resolveStepRec(steps, [1])).toEqual(steps[1]);
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
      expect(service.resolveStepRec(steps, [0, 0, 0])).toEqual(
        steps[0].for?.do[0]
      );
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
      expect(service.resolveStepRec(steps, [0])).toEqual(steps[0]);
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
      expect(service.resolveAllStepsRec(steps, [0])).toEqual([steps[0]]);
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
      expect(service.resolveAllStepsRec(steps, [0, 0, 0])).toEqual([
        steps[0],
        steps[0].for?.do[0],
      ]);
    });
  });
});
