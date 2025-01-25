import React from "react";
import { ArrowDownIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWorkflowStore } from "@/store/workflow.store";
import { useExecutionStore } from "@/store/execution.store";

const WorkflowFlowchart = ({ workflowId }: { workflowId: string }) => {
  const { workflows, reorderTasks } = useWorkflowStore();
  const { currentTaskId, taskResults } = useExecutionStore();
  const workflow = workflows.find((w) => w.id === workflowId);

  if (!workflow) return null;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("taskId");
    if (draggedTaskId !== targetTaskId) {
      const targetTask = workflow.tasks.find((t) => t.id === targetTaskId);
      if (targetTask) {
        reorderTasks(workflowId, draggedTaskId, targetTask.order);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {workflow.tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <Card
              className={`p-4 bg-white shadow-sm ${
                currentTaskId === task.id ? "ring-2 ring-blue-500" : ""
              } ${
                taskResults[task.id]?.success
                  ? "bg-green-50"
                  : taskResults[task.id]?.error
                  ? "bg-red-50"
                  : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500">{task.type}</p>
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
    </div>
  );
};

export default WorkflowFlowchart;
