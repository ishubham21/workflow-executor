import { BaseTask } from "./task.types";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  tasks: BaseTask[];
  status: "idle" | "running" | "completed" | "error";
}

export interface WorkflowState {
  workflows: Workflow[];
  addWorkflow: (name: string, description?: string) => Workflow;
  removeWorkflow: (id: string) => void;
  addTask: (workflowId: string, task: Omit<BaseTask, "id" | "order">) => void;
  removeTask: (workflowId: string, taskId: string) => void;
  updateTask: (
    workflowId: string,
    taskId: string,
    updates: Partial<BaseTask>
  ) => void;
  reorderTasks: (workflowId: string, taskId: string, newOrder: number) => void;
}
