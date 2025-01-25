import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, X } from "lucide-react";
import { useWorkflowStore } from "@/store/workflow.store";
import { TaskSelector } from "./taskSelector";
import { TaskForm } from "./taskForm";
import { useTaskDefinitionStore } from "@/store/taskDefinition.store";

const TaskList = ({ workflowId }: { workflowId: string }) => {
  const { workflows, addTask, removeTask, reorderTasks } = useWorkflowStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null);

  const workflow = workflows.find((w) => w.id === workflowId);
  if (!workflow) return null;

  const handleTaskSubmit = (config: Record<string, any>) => {
    console.log({ config });
    if (selectedTaskType) {
      const taskDef =
        useTaskDefinitionStore.getState().definitions[selectedTaskType];
      addTask(workflowId, {
        type: selectedTaskType,
        name: taskDef.name,
        config,
      });
      setShowTaskForm(false);
      setSelectedTaskType(null);
    }
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Task
        </Button>
      </div>

      {showTaskForm && (
        <Card className="mb-4 p-4">
          <TaskSelector onSelect={setSelectedTaskType} />
          {selectedTaskType && (
            <TaskForm type={selectedTaskType} onSubmit={handleTaskSubmit} />
          )}
        </Card>
      )}

      <div className="space-y-2">
        {workflow.tasks.map((task) => (
          <Card
            key={task.id}
            className="p-4 flex items-center gap-4"
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, task.id)}
          >
            <GripVertical className="cursor-move text-gray-400" size={20} />
            <div className="flex-grow">
              <div className="font-medium">{task.name}</div>
              <div className="text-sm text-gray-500">{task.type}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTask(workflowId, task.id)}
            >
              <X size={16} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
