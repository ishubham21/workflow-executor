import { TaskResult } from "@/types/task.types";
import { create } from "zustand";
import { v4 as uuid } from "uuid";

interface ExecutionState {
  currentWorkflowId: string | null;
  currentTaskId: string | null;
  executionStatus: "idle" | "running" | "completed" | "error";
  taskResults: Record<string, TaskResult>;
  logs: Array<{
    runId: string;
    timestamp: number;
    taskId: string;
    message: string;
    type: "info" | "error" | "success";
  }>;
  runs: Array<{
    id: string;
    startTime: number;
    endTime?: number;
    status: "running" | "completed" | "error";
  }>;

  setCurrentWorkflow: (id: string | null) => void;
  setCurrentTaskId: (id: string | null) => void;
  setExecutionStatus: (status: ExecutionState["executionStatus"]) => void;
  addTaskResult: (taskId: string, result: TaskResult) => void;
  addLog: (
    runId: string,
    taskId: string,
    message: string,
    type: "info" | "error" | "success"
  ) => void;
  startRun: () => string;
  endRun: (runId: string, status: "completed" | "error") => void;
  clearExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  currentWorkflowId: null,
  currentTaskId: null,
  executionStatus: "idle",
  taskResults: {},
  logs: [],
  runs: [],

  setCurrentWorkflow: (id) => set({ currentWorkflowId: id }),
  setCurrentTaskId: (id) => set({ currentTaskId: id }),
  setExecutionStatus: (status) => set({ executionStatus: status }),

  addTaskResult: (taskId, result) =>
    set((state) => ({
      taskResults: { ...state.taskResults, [taskId]: result },
    })),

  addLog: (runId, taskId, message, type) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          runId,
          timestamp: Date.now(),
          taskId,
          message,
          type,
        },
      ],
    })),

  startRun: () => {
    const runId = uuid();
    set((state) => ({
      runs: [
        ...state.runs,
        {
          id: runId,
          startTime: Date.now(),
          status: "running",
        },
      ],
    }));
    return runId;
  },

  endRun: (runId, status) =>
    set((state) => ({
      runs: state.runs.map((run) =>
        run.id === runId ? { ...run, status, endTime: Date.now() } : run
      ),
    })),

  clearExecution: () =>
    set({
      executionStatus: "idle",
      currentTaskId: null,
      taskResults: {},
    }),
}));
