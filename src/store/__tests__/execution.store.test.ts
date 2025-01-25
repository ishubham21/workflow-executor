import { useExecutionStore } from "../execution.store";
import { TaskResult } from "@/types/task.types";

describe("Execution Store", () => {
  beforeEach(() => {
    useExecutionStore.getState().clearExecution();
  });

  describe("Basic State Management", () => {
    it("should initialize with default values", () => {
      const state = useExecutionStore.getState();
      expect(state.currentWorkflowId).toBeNull();
      expect(state.currentTaskId).toBeNull();
      expect(state.executionStatus).toBe("idle");
      expect(state.taskResults).toEqual({});
      expect(state.taskExecutionTimes).toEqual({});
      expect(state.logs).toEqual([]);
      expect(state.runs).toEqual([]);
    });

    it("should set current workflow id", () => {
      useExecutionStore.getState().setCurrentWorkflow("workflow-1");
      expect(useExecutionStore.getState().currentWorkflowId).toBe("workflow-1");
    });

    it("should set current task id", () => {
      useExecutionStore.getState().setCurrentTaskId("task-1");
      expect(useExecutionStore.getState().currentTaskId).toBe("task-1");
    });

    it("should set execution status", () => {
      useExecutionStore.getState().setExecutionStatus("running");
      expect(useExecutionStore.getState().executionStatus).toBe("running");
    });
  });

  describe("Task Management", () => {
    it("should add task result", () => {
      //@ts-ignore
      const result: TaskResult = { output: "test output", error: null };
      useExecutionStore.getState().addTaskResult("task-1", result);
      expect(useExecutionStore.getState().taskResults["task-1"]).toEqual(
        result
      );
    });

    it("should track task execution timing", () => {
      const runId = useExecutionStore.getState().startRun();
      useExecutionStore.getState().startTaskExecution(runId, "task-1");

      // Simulate delay
      jest.advanceTimersByTime(1000);

      useExecutionStore.getState().endTaskExecution(runId, "task-1");
      const run = useExecutionStore.getState().runs.find((r) => r.id === runId);

      expect(run?.taskTimings["task-1"].start).toBeDefined();
      expect(run?.taskTimings["task-1"].end).toBeDefined();
      expect(
        useExecutionStore.getState().taskExecutionTimes["task-1"]
      ).toBeGreaterThan(0);
    });
  });

  describe("Run Management", () => {
    it("should start a new run and return run id", () => {
      const runId = useExecutionStore.getState().startRun();
      const run = useExecutionStore.getState().runs.find((r) => r.id === runId);

      expect(runId).toBeDefined();
      expect(run).toBeDefined();
      expect(run?.status).toBe("running");
      expect(run?.startTime).toBeDefined();
    });

    it("should end run with status", () => {
      const runId = useExecutionStore.getState().startRun();
      useExecutionStore.getState().endRun(runId, "completed");

      const run = useExecutionStore.getState().runs.find((r) => r.id === runId);
      expect(run?.status).toBe("completed");
      expect(run?.endTime).toBeDefined();
    });
  });

  describe("Logging", () => {
    it("should add log entry", () => {
      const runId = useExecutionStore.getState().startRun();
      useExecutionStore
        .getState()
        .addLog(runId, "task-1", "Test message", "info");

      const logs = useExecutionStore.getState().logs;
      expect(logs).toHaveLength(1);
      expect(logs[0]).toEqual(
        expect.objectContaining({
          runId,
          taskId: "task-1",
          message: "Test message",
          type: "info",
        })
      );
    });
  });

  describe("Clear Execution", () => {
    it("should reset execution state", () => {
      useExecutionStore.getState().setCurrentTaskId("task-1");
      useExecutionStore.getState().setExecutionStatus("running");
      useExecutionStore
        .getState()
        //@ts-ignore
        .addTaskResult("task-1", { output: "test", error: null });

      useExecutionStore.getState().clearExecution();

      const state = useExecutionStore.getState();
      expect(state.currentTaskId).toBeNull();
      expect(state.executionStatus).toBe("idle");
      expect(state.taskResults).toEqual({});
      expect(state.taskExecutionTimes).toEqual({});
    });
  });
});
