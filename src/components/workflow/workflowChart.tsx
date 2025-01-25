import React, { memo, useCallback, useMemo, useState } from "react";
import { ArrowDownIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWorkflowStore } from "@/store/workflow.store";
import { useExecutionStore } from "@/store/execution.store";
import { TaskDetails } from "../task/taskDetails";

interface IWorkflowChart {
  workflowId: string;
}

const WorkflowFlowchart = memo(({ workflowId }: IWorkflowChart) => {
  const { workflows, reorderTasks } = useWorkflowStore();
  const { currentTaskId, taskResults, taskExecutionTimes } =
    useExecutionStore();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const workflow = useMemo(
    () => workflows.find((w) => w.id === workflowId),
    [workflowId, workflows]
  );

  const handleTaskClick = useCallback(
    (task: any) => {
      setSelectedTask(task);
    },
    [setSelectedTask]
  );

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetTaskId: string) => {
      e.preventDefault();
      const draggedTaskId = e.dataTransfer.getData("taskId");
      if (draggedTaskId !== targetTaskId) {
        const targetTask = workflow?.tasks.find((t) => t.id === targetTaskId);
        if (targetTask) {
          reorderTasks(workflowId, draggedTaskId, targetTask.order);
        }
      }
    },
    [reorderTasks, workflow?.tasks, workflowId]
  );

  if (!workflow) return null;

  return (
    <div className="p-4">
      <div className="space-y-4">
        {workflow.tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <Card
              className={`p-4 bg-white shadow-sm cursor-pointer ${
                currentTaskId === task.id ? "ring-2 ring-blue-500" : ""
              } ${
                taskResults[task.id]?.success
                  ? "bg-green-50"
                  : taskResults[task.id]?.error
                  ? "bg-red-50"
                  : ""
              }`}
              draggable
              onClick={() => handleTaskClick(task)}
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500">{task.type}</p>
                  {taskExecutionTimes[task.id] && (
                    <p className="text-xs text-gray-400">
                      Execution time: {taskExecutionTimes[task.id]}ms
                    </p>
                  )}
                </div>
                <div className="text-gray-400 cursor-move">:::</div>
              </div>
            </Card>
            {index < workflow.tasks.length - 1 && (
              <div className="flex justify-center">
                <ArrowDownIcon className="text-gray-400" size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          executionTime={taskExecutionTimes[selectedTask.id]}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
});

export default WorkflowFlowchart;
