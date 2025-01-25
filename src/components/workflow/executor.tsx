import { Button } from '@/components/ui/button';
import { TaskExecutor } from '@/executors/workflow.executor';
import { useExecutionStore } from '@/store/execution.store';
import { useWorkflowStore } from '@/store/workflow.store';
import { Play, StopCircle } from 'lucide-react';

const WorkflowExecutor = ({ workflowId }: { workflowId: string }) => {
  const { workflows } = useWorkflowStore();
  const { 
    setCurrentWorkflow,
    setExecutionStatus,
    addTaskResult,
    addLog,
    clearExecution,
    executionStatus
  } = useExecutionStore();

  const workflow = workflows.find(w => w.id === workflowId);
  const executor = new TaskExecutor();

  const executeWorkflow = async () => {
    if (!workflow) return;

    clearExecution();
    setCurrentWorkflow(workflowId);
    setExecutionStatus('running');
    addLog('system', 'Starting workflow execution', 'info');

    for (const task of workflow.tasks) {
      addLog(task.id, `Executing task: ${task.name}`, 'info');
      
      try {
        //@ts-ignore
        const result = await executor.executeTask(task.config);
        addTaskResult(task.id, result);
        
        if (result.success) {
          addLog(task.id, 'Task completed successfully', 'success');
        } else {
          addLog(task.id, `Task failed: ${result.error}`, 'error');
          setExecutionStatus('error');
          return;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addLog(task.id, `Task failed: ${errorMessage}`, 'error');
        setExecutionStatus('error');
        return;
      }
    }

    setExecutionStatus('completed');
    addLog('system', 'Workflow execution completed', 'success');
  };

  const stopExecution = () => {
    setExecutionStatus('idle');
    addLog('system', 'Workflow execution stopped', 'info');
  };

  if (!workflow) return null;

  return (
    <div className="flex items-center gap-4">
      {executionStatus === 'running' ? (
        <Button onClick={stopExecution} variant="destructive" className="flex items-center gap-2">
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
      <div className="text-sm text-gray-500">
        {workflow.tasks.length} tasks
      </div>
    </div>
  );
};

export default WorkflowExecutor;