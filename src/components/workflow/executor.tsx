import { Button } from "@/components/ui/button";
import { TaskExecutor } from "@/executors/workflow.executor";
import { useToast } from "@/hooks/use-toast";
import { useExecutionStore } from "@/store/execution.store";
import { useWorkflowStore } from "@/store/workflow.store";
import { Play, StopCircle } from "lucide-react";
import dayjs from "dayjs";

const WorkflowExecutor = ({ workflowId }: { workflowId: string }) => {
  const { workflows } = useWorkflowStore();
  const { toast } = useToast();
  const {
    setCurrentWorkflow,
    setExecutionStatus,
    addTaskResult,
    addLog,
    clearExecution,
    executionStatus,
    setCurrentTaskId,
    startRun,
    endRun,
  } = useExecutionStore();

  const workflow = workflows.find((w) => w.id === workflowId);
  const executor = new TaskExecutor();

  const executeWorkflow = async () => {
    if (!workflow) return;

    clearExecution();
    const runId = startRun();
    setCurrentWorkflow(workflowId);
    setExecutionStatus("running");
    addLog(
      runId,
      "system",
      `Starting workflow execution (Timestamp: ${dayjs().format()})`,
      "info"
    );
    toast({
      title: "Workflow Started",
      description: `Executing ${workflow.name}`,
    });

    for (const task of workflow.tasks) {
      setCurrentTaskId(task.id);
      addLog(runId, task.id, `Executing task: ${task.name}`, "info");

      try {
        //@ts-ignore
        const result = await executor.executeTask(task.config);
        addTaskResult(task.id, result);

        if (result.success) {
          addLog(runId, task.id, "Task completed successfully", "success");
        } else {
          addLog(
            runId,
            task.id,
            `Task failed: ${result.error} (Timestamp: ${dayjs().format()})`,
            "error"
          );
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
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addLog(runId, task.id, `Task failed: ${errorMessage}`, "error");
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
    addLog(
      runId,
      "system",
      `Workflow execution completed (Timestamp: ${dayjs().format()})`,
      "success"
    );
    toast({
      title: "Workflow Completed",
      description: `Successfully executed ${workflow.name}`,
      variant: "default",
    });
  };

  const stopExecution = () => {
    const runId = crypto.randomUUID();
    setExecutionStatus("idle");
    addLog(runId, "system", "Workflow execution stopped", "info");
    endRun(runId, "error");
    toast({
      title: "Workflow Stopped",
      description: "Execution was manually stopped",
      variant: "default",
    });
  };

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
};

export default WorkflowExecutor;
