import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Workflow, WorkflowState } from "@/types/workflow.types";

/**
 * Define the store for managing workflow state
 */
export const useWorkflowStore = create<WorkflowState>((set) => ({
  // Store all workflows
  workflows: [],

  /**
   * Add a new workflow with given name and description
   * Returns the newly created workflow object
   */
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
        newWorkflow,
      ],
    }));
    return newWorkflow;
  },

  // Remove a workflow by its ID
  removeWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
    })),

  /**
   * Add a new task to a specific workflow
   * Generates new ID and sets order based on existing tasks
   */
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

  // Remove a specific task from a workflow
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

  // Update a specific task's properties
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

  /**
   * Reorder tasks within a workflow
   * Updates order of all affected tasks and sorts them
   */
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
