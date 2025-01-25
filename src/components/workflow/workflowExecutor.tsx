import { Button } from "@/components/ui/button";
import { TaskExecutor } from "@/executors/workflow.executor";
import { useToast } from "@/hooks/use-toast";
import { useExecutionStore } from "@/store/execution.store";
import { useWorkflowStore } from "@/store/workflow.store";
import { Play, StopCircle } from "lucide-react";
import dayjs from "dayjs";
import { BatchExecutor } from "@/executors/batch.executor";
import { v4 as uuid } from "uuid";
import { memo, useCallback } from "react";

interface IWorkflowExecutor {
  workflowId: string;
}

const WorkflowExecutor = memo(({ workflowId }: IWorkflowExecutor) => {
  const { workflows } = useWorkflowStore();
  const { toast } = useToast();
  const {
    setCurrentWorkflow,
    setExecutionStatus,
    clearExecution,
    executionStatus,
    setCurrentTaskId,
    startRun,
    endRun,
  } = useExecutionStore();

  const workflow = workflows.find((w) => w.id === workflowId);
  const executor = new TaskExecutor();
  const batchExecutor = new BatchExecutor();

  const executeWorkflow = useCallback(async () => {
    if (!workflow) return;

    clearExecution();
    const runId = startRun();
    const startTime = Date.now();

    setCurrentWorkflow(workflowId);
    setExecutionStatus("running");

    batchExecutor.addUpdate({
      taskId: "system",
      result: { success: true, outputs: {} },
      executionTime: 0,
      logs: [
        {
          message: `Starting workflow execution (Timestamp: ${dayjs().format()})`,
          type: "info",
        },
      ],
    });

    toast({
      title: "Workflow Started",
      description: `Executing ${workflow.name}`,
    });

    for (const task of workflow.tasks) {
      setCurrentTaskId(task.id);
      const taskStartTime = Date.now();

      batchExecutor.addUpdate({
        taskId: task.id,
        result: { success: true, outputs: {} },
        executionTime: 0,
        logs: [
          {
            message: `Executing task: ${task.name} (Task Id: ${task.id.slice(0, 8)})`,
            type: "info",
          },
        ],
      });

      try {
        //@ts-ignore
        const result = await executor.executeTask(task.config);
        const taskEndTime = Date.now();

        batchExecutor.addUpdate({
          taskId: task.id,
          result,
          executionTime: taskEndTime - taskStartTime,
          logs: [
            {
              message: result.success
                ? "Task completed successfully"
                : `Task failed: ${result.error}`,
              type: result.success ? "success" : "error",
            },
          ],
        });

        if (!result.success) {
          setExecutionStatus("error");
          endRun(runId, "error");
          toast({
            title: "Workflow Failed",
            description: `Failed at task: ${task.name}\n${result.error}`,
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        const taskEndTime = Date.now();
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        batchExecutor.addUpdate({
          taskId: task.id,
          result: { success: false, outputs: {}, error: errorMessage },
          executionTime: taskEndTime - taskStartTime,
          logs: [
            {
              message: `Task failed: ${errorMessage}`,
              type: "error",
            },
          ],
        });

        setExecutionStatus("error");
        endRun(runId, "error");
        toast({
          title: "Workflow Failed",
          description: `Error in task ${task.name}: ${errorMessage}`,
          variant: "destructive",
        });
        return;
      }
    }

    setExecutionStatus("completed");
    endRun(runId, "completed");

    batchExecutor.addUpdate({
      taskId: "system",
      result: { success: true, outputs: {} },
      executionTime: Date.now() - startTime,
      logs: [
        {
          message: `Workflow execution completed (Timestamp: ${dayjs().format()})`,
          type: "success",
        },
      ],
    });

    toast({
      title: "Workflow Completed",
      description: `Successfully executed ${workflow.name}`,
      variant: "default",
    });
  }, [workflow, workflowId]);

  const stopExecution = useCallback(() => {
    const runId = uuid();
    setExecutionStatus("idle");

    batchExecutor.addUpdate({
      taskId: "system",
      result: { success: false, outputs: {} },
      executionTime: 0,
      logs: [
        {
          message: "Workflow execution stopped",
          type: "info",
        },
      ],
    });

    endRun(runId, "error");
    toast({
      title: "Workflow Stopped",
      description: "Execution was manually stopped",
      variant: "default",
    });
  }, []);

  if (!workflow) return null;

  return (
    <div className="flex items-center gap-4">
      {executionStatus === "running" ? (
        <Button
          onClick={stopExecution}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <StopCircle size={16} />
          Stop
        </Button>
      ) : (
        <Button
          onClick={executeWorkflow}
          disabled={workflow.tasks.length === 0}
          className="flex items-center gap-2"
        >
          <Play size={16} />
          Execute Workflow
        </Button>
      )}
      <div className="text-sm text-gray-500">{workflow.tasks.length} tasks</div>
    </div>
  );
});

export default WorkflowExecutor;
