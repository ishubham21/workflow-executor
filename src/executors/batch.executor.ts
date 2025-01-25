import { useExecutionStore } from "@/store/execution.store";
import { TaskResult } from "@/types/task.types";

interface BatchUpdate {
  taskId: string;
  result: TaskResult;
  executionTime: number;
  logs: Array<{
    message: string;
    type: "info" | "error" | "success";
  }>;
}

/**
 * BatchExecutor is a utility class that batches store updates
 * and flushes them after a certain number of updates or a timeout.
 * 
 * This is useful for batching updates to the store to prevent multiple re-renders.
 */
export class BatchExecutor {
  private batchSize: number;
  private batchTimeout: number;
  private updates: BatchUpdate[] = [];
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(batchSize = 5, batchTimeout = 1000) {
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
  }

  addUpdate(update: BatchUpdate) {
    this.updates.push(update);

    if (this.updates.length >= this.batchSize) {
      this.flush();
    } else if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => this.flush(), this.batchTimeout);
    }
  }

  private flush() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.updates.length > 0) {
      this.processUpdates(this.updates);
      this.updates = [];
    }
  }

  private processUpdates(updates: BatchUpdate[]) {
    // Batch store updates
    const taskResults: Record<string, TaskResult> = {};
    const executionTimes: Record<string, number> = {};
    const logs: Array<{ taskId: string; message: string; type: string }> = [];

    updates.forEach((update) => {
      taskResults[update.taskId] = update.result;
      executionTimes[update.taskId] = update.executionTime;
      update.logs.forEach((log) => {
        logs.push({
          taskId: update.taskId,
          message: log.message,
          type: log.type,
        });
      });
    });

    // Single store update
    useExecutionStore.setState((state) => ({
      ...state,
      taskResults: { ...state.taskResults, ...taskResults },
      taskExecutionTimes: { ...state.taskExecutionTimes, ...executionTimes },
      logs: [
        ...state.logs,
        ...logs.map((log) => ({
          ...log,
          runId: state.currentTaskId ?? "",
          timestamp: Date.now(),
          type: log.type as "info" | "error" | "success",
        })),
      ],
    }));
  }
}
