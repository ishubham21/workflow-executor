import { create } from "zustand";
import { TaskResult } from "../types/task.types";

interface ExecutionState {
  currentWorkflowId: string | null;
  executionStatus: "idle" | "running" | "completed" | "error";
  taskResults: Record<string, TaskResult>;
  logs: Array<{
    timestamp: number;
    taskId: string;
    message: string;
    type: "info" | "error" | "success";
  }>;

  setCurrentWorkflow: (id: string | null) => void;
  setExecutionStatus: (status: ExecutionState["executionStatus"]) => void;
  addTaskResult: (taskId: string, result: TaskResult) => void;
  addLog: (
    taskId: string,
    message: string,
    type: "info" | "error" | "success"
  ) => void;
  clearExecution: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  currentWorkflowId: null,
  executionStatus: "idle",
  taskResults: {},
  logs: [],
  setCurrentWorkflow: (id) => set({ currentWorkflowId: id }),
  setExecutionStatus: (status) => set({ executionStatus: status }),
  addTaskResult: (taskId, result) =>
    set((state) => ({
      taskResults: { ...state.taskResults, [taskId]: result },
    })),
  addLog: (taskId, message, type) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          timestamp: Date.now(),
          taskId,
          message,
          type,
        },
      ],
    })),
  clearExecution: () =>
    set({
      executionStatus: "idle",
      taskResults: {},
      logs: [],
    }),
}));
