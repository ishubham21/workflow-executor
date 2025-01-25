import { useWorkflowStore } from "../workflow.store";
import { act, renderHook } from "@testing-library/react";

describe("WorkflowStore", () => {
  beforeEach(() => {
    useWorkflowStore.setState({ workflows: [] });
  });

  describe("addWorkflow", () => {
    it("should add new workflow", () => {
      const { result } = renderHook(() => useWorkflowStore());
      let workflowId: string;

      act(() => {
        const workflow = result.current.addWorkflow("Test", "Description");
        workflowId = workflow.id;
      });

      expect(result.current.workflows[0]).toEqual({
        //@ts-ignore
        id: workflowId,
        name: "Test",
        description: "Description",
        tasks: [],
        status: "idle",
      });
    });
  });

  describe("removeWorkflow", () => {
    it("should remove workflow", () => {
      const { result } = renderHook(() => useWorkflowStore());
      let workflowId: string;

      act(() => {
        const workflow = result.current.addWorkflow("Test");
        workflowId = workflow.id;
      });

      act(() => {
        result.current.removeWorkflow(workflowId);
      });

      expect(result.current.workflows).toHaveLength(0);
    });
  });

  describe("addTask", () => {
    it("should add task to workflow", () => {
      const { result } = renderHook(() => useWorkflowStore());
      let workflowId: string;

      act(() => {
        const workflow = result.current.addWorkflow("Test");
        workflowId = workflow.id;
      });

      act(() => {
        result.current.addTask(workflowId, {
          type: "test",
          name: "Test Task",
          config: {},
        });
      });

      const workflow = result.current.workflows.find(
        (w) => w.id === workflowId
      );
      expect(workflow?.tasks[0]).toMatchObject({
        type: "test",
        name: "Test Task",
        order: 0,
      });
    });
  });

  describe("reorderTasks", () => {
    it("should reorder tasks", () => {
      const { result } = renderHook(() => useWorkflowStore());
      let workflowId: string;
      let firstTaskId: string;

      act(() => {
        const workflow = result.current.addWorkflow("Test");
        workflowId = workflow.id;
      });

      act(() => {
        result.current.addTask(workflowId, {
          type: "test",
          name: "Task 1",
          config: {},
        });
        result.current.addTask(workflowId, {
          type: "test",
          name: "Task 2",
          config: {},
        });
      });

      const workflow = result.current.workflows.find(
        (w) => w.id === workflowId
      );
      firstTaskId = workflow!.tasks[0].id;

      act(() => {
        result.current.reorderTasks(workflowId, firstTaskId, 1);
      });

      const updatedWorkflow = result.current.workflows.find(
        (w) => w.id === workflowId
      );
      expect(updatedWorkflow?.tasks[0].name).toBe("Task 1");
      expect(updatedWorkflow?.tasks[1].name).toBe("Task 2");
    });
  });
});
