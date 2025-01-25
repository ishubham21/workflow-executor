import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowDownIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWorkflowStore } from "@/store/workflow.store";
import { useExecutionStore } from "@/store/execution.store";

const WorkflowFlowchart = ({ workflowId }: { workflowId: string }) => {
  const { workflows, reorderTasks } = useWorkflowStore();
  const { currentTaskId, taskResults } = useExecutionStore();
  const workflow = workflows.find((w) => w.id === workflowId);

  if (!workflow) return null;

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newOrder = result.destination.index;
    reorderTasks(workflowId, taskId, newOrder);
  };

  return (
    <div className="p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workflow">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {workflow.tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <Draggable draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          className={`p-4 bg-white shadow-sm ${
                            currentTaskId === task.id
                              ? "ring-2 ring-blue-500"
                              : ""
                          } ${
                            taskResults[task.id]?.success
                              ? "bg-green-50"
                              : taskResults[task.id]?.error
                              ? "bg-red-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{task.name}</h3>
                              <p className="text-sm text-gray-500">
                                {task.type}
                              </p>
                            </div>
                            <div className="text-gray-400">:::</div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                  {index < workflow.tasks.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowDownIcon className="text-gray-400" size={20} />
                    </div>
                  )}
                </React.Fragment>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default WorkflowFlowchart;
