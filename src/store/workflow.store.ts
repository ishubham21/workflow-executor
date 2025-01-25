import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Workflow, WorkflowState } from "../types/workflow.types";

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  addWorkflow: (name, description) => {
    const newWorkflow = {
      id: uuidv4(),
      name,
      description,
      tasks: [],
      status: "idle",
    } as Workflow;
    set((state) => ({
      workflows: [
        ...state.workflows,
        {
          id: uuidv4(),
          name,
          description,
          tasks: [],
          status: "idle",
        },
      ],
    }));
    return newWorkflow;
  },
  removeWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
    })),
  addTask: (workflowId, task) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              tasks: [
                ...workflow.tasks,
                {
                  ...task,
                  id: uuidv4(),
                  order: workflow.tasks.length,
                },
              ],
            }
          : workflow
      ),
    })),
  removeTask: (workflowId, taskId) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              tasks: workflow.tasks.filter((t) => t.id !== taskId),
            }
          : workflow
      ),
    })),
  updateTask: (workflowId, taskId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              tasks: workflow.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : workflow
      ),
    })),
  reorderTasks: (workflowId, taskId, newOrder) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              tasks: workflow.tasks
                .map((task) => ({
                  ...task,
                  order:
                    task.id === taskId
                      ? newOrder
                      : task.order >= newOrder
                      ? task.order + 1
                      : task.order,
                }))
                .sort((a, b) => a.order - b.order),
            }
          : workflow
      ),
    })),
}));
